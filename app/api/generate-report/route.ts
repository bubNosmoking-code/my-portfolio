import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// 1. 引入底层网络库
import { setGlobalDispatcher, ProxyAgent } from 'undici';

// ==========================================
// 2. 强行接管网络请求 (核武器级代理)
// ==========================================
// ⚠️⚠️⚠️ 请确认你的端口号！(Clash通常是7890, v2ray是10809)
const PROXY_PORT = 4780; 
const PROXY_URL = `http://127.0.0.1:${PROXY_PORT}`;

// 只有在本地开发时才开启代理
if (process.env.NODE_ENV === "development") {
  const dispatcher = new ProxyAgent({
    uri: PROXY_URL,
    connect: { rejectUnauthorized: false }
  });
  setGlobalDispatcher(dispatcher);
}

// ==========================================
// 3. 正常的业务逻辑
// ==========================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    // --- 这里是修改的核心：提示词 (Prompt) ---
    const prompt = `
      你是一位顶级的运动生理学家和营养专家。请分析以下客户数据，并生成一份专业的健康报告。
      
      客户数据:
      ${JSON.stringify(userData)}

      任务:
      生成一份详细的 JSON 报告，包含：
      1. 健康评分 (0-100) 和等级 (S/A/B/C/D)。
      2. 身体成分分析 (BMI, 体脂率, 肌肉量, 内脏脂肪)。
      3. 3 个关键健康风险 (高/中/低)。
      4. 每日热量消耗 (TDEE) 和 宏量营养素目标 (蛋白质/碳水/脂肪 克数)。
      5. 7天训练计划 (简略版)。
      6. 补剂建议。

      输出格式要求:
      1. **必须只返回有效的 JSON 格式**。不要返回 Markdown，不要有解释性文字。
      2. **JSON 的 Key (键名) 必须保持英文** (例如 healthScore, analysis, risks)，以便代码读取。
      3. **JSON 的 Value (值/内容) 必须是 简体中文**。

      JSON 结构模版:
      {
        "healthScore": 85,
        "healthGrade": "B",
        "summary": "一句话总结用户的身体状况...",
        "analysis": {
          "bmi": {"value": 24.5, "status": "正常", "assessment": "你的BMI处于标准范围..."},
          "bodyFat": {"value": 20, "status": "偏高", "assessment": "体脂略高于运动员标准..."},
          "muscle": {"value": 30, "status": "偏低", "assessment": "建议增加抗阻训练..."}
        },
        "risks": [
          {"level": "高", "title": "胰岛素抵抗风险", "description": "由于腰臀比偏高..."}
        ],
        "nutrition": {
          "tdee": 2400,
          "targetCalories": 2000,
          "macros": {"protein": 180, "carbs": 200, "fat": 60},
          "supplements": ["肌酸", "乳清蛋白"]
        },
        "training": [
          {"day": "周一", "focus": "推类训练", "exercises": "平板卧推 4x8, 哑铃推举 3x12..."}
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 清洗 JSON
    const jsonString = text.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(jsonString);

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("❌ AI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
