"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, ChevronRight, Zap, Ruler, RotateCcw, AlertTriangle, Loader2, Scan, Droplets, Flame, Dumbbell, Scale, FileText, Settings, ShieldAlert, Calendar, CheckCircle } from 'lucide-react';

// --- 1. 全局配置与类型定义 ---

const THEME_COLOR = '#FF5500'; // 战术橙
const THEME_TEXT = 'text-[#FF5500]';
const THEME_BG = 'bg-[#FF5500]';
const THEME_BORDER = 'border-[#FF5500]';

type ViewState = 'scanner' | 'report' | 'workout';

// 输入表单数据结构
interface FormData {
  // 基础信息
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  
  // 身体指标
  bodyFatRate: number;      // 体脂率 %
  bodyFatMass: number;      // 体脂肪量 kg
  skeletalMuscle: number;   // 骨骼肌 kg
  bodyWater: number;        // 身体水分 kg
  bmr: number;              // 基础代谢 kcal
  waist: number;            // 腰围
  hip: number;              // 臀围

  // 状态标记 (是否未知)
  unknowns: {
    bodyFat: boolean;
    muscle: boolean;
    water: boolean;
    bmr: boolean;
    waist: boolean;
  };

  // 任务参数 (Context)
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
  goal: 'loss' | 'gain' | 'recomp' | 'performance';
  
  // 上下文感知字段
  frequency: number; // 周训练天数 (1-7)
  equipment: string[]; // ['bodyweight', 'dumbbell', 'barbell', 'gym']
  injuries: string[]; // ['knee', 'back', 'shoulder', 'wrist']
}

// 详细报告数据结构
interface DetailedReport {
  basicInfo: { date: string; device: string; bmi: string };
  composition: { 
    weight: string; fatRate: string; fatMass: string; 
    muscleMass: string; ffm: string; // 去脂体重
    visceralFat: number; waterRate: string; 
  };
  proportion: {
    waist: string; whr: string; // 腰臀比
    distributionAnalysis: string;
  };
  metabolic: {
    bmr: string; metabolicAge: number; dailyCalorie: number;
  };
  risk: {
    obesityLevel: string; visceralRisk: string; metabolicRisk: string;
  };
  goalAnalysis: {
    summary: string; trend: string;
  };
  action: {
    direction: string; frequency: string; 
    calorieTarget: string; proteinTarget: string; reviewCycle: string;
  };
}

// 训练计划数据结构
interface WorkoutPlan {
  title: string;
  duration: string;
  intensity: string;
  tags: string[];
  warmup: Array<{ name: string; duration: string; note: string }>;
  main: Array<{ name: string; sets: string; reps: string; rest: string; note: string }>;
  cooldown: Array<{ name: string; duration: string; note: string }>;
}

// --- 2. 核心组件：生物雷达 (Bio-Radar) ---

const BioRadar = ({ formData }: { formData: FormData }) => {
  // 辅助函数：如果数据未知，使用估算公式计算用于显示的“虚值”
  const getDisplayValue = () => {
    // 基础估算 (Mifflin-St Jeor 公式)
    const estBMR = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + (formData.gender === 'male' ? 5 : -161);
    // 简单估算体脂 (BMI法)
    const bmi = formData.weight / ((formData.height / 100) ** 2);
    const estFatRate = (1.2 * bmi) + (0.23 * formData.age) - (10.8 * (formData.gender === 'male' ? 1 : 0)) - 5.4;
    
    return {
      bmi: bmi,
      fatRate: formData.unknowns.bodyFat ? estFatRate : formData.bodyFatRate,
      muscle: formData.unknowns.muscle ? (formData.weight * (1 - estFatRate/100) * 0.5) : formData.skeletalMuscle, // 粗略估算
      water: formData.unknowns.water ? (formData.weight * 0.6) : formData.bodyWater,
      bmr: formData.unknowns.bmr ? estBMR : formData.bmr,
    };
  };

  const val = getDisplayValue();

  // 归一化得分 (0-100)，用于雷达图绘制
  const scores = [
    Math.min(Math.max(val.muscle * 2, 30), 100),           // 肌肉
    Math.min(Math.max((val.bmr - 1000) / 20, 30), 100),    // 代谢
    Math.min(Math.max(val.water * 1.5, 30), 100),          // 水分
    Math.min(Math.max(val.fatRate * 2.5, 30), 100),        // 体脂率
    Math.min(Math.max((val.bmi - 15) * 4, 30), 100),       // BMI
    Math.min(Math.max(formData.weight * 1.2, 30), 100)     // 整体围度
  ];

  const labels = ["骨骼肌", "基础代谢", "身体水分", "体脂率", "BMI", "总体重"];
  
  // SVG 绘图计算
  const calculatePoints = (data: number[], radius: number) => {
    const center = 150;
    return data.map((score, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (score / 100) * radius;
      return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
    }).join(' ');
  };

  const polyPoints = calculatePoints(scores, 100);
  const bgPolyPoints = calculatePoints([100,100,100,100,100,100], 100);
  const midPolyPoints = calculatePoints([50,50,50,50,50,50], 100);

  // 警示色逻辑
  const isDanger = val.fatRate > 30 || val.bmi > 28;
  const radarColor = isDanger ? '#FF3B30' : THEME_COLOR;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* 背景旋转圈 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-[200px] h-[200px] border border-white/5 rounded-full border-dashed animate-[spin_20s_linear_infinite_reverse]"></div>
        </div>

        <svg viewBox="0 0 300 300" className="w-full max-w-[400px] h-auto drop-shadow-[0_0_15px_rgba(255,85,0,0.3)]">
            {/* 网格 */}
            <polygon points={bgPolyPoints} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
            <polygon points={midPolyPoints} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* 轴线 */}
            {scores.map((_, i) => {
                 const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                 const x = 150 + Math.cos(angle) * 100;
                 const y = 150 + Math.sin(angle) * 100;
                 return <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="white" strokeOpacity="0.1" strokeWidth="1" />
            })}

            {/* 数据区域 */}
            <polygon 
                points={polyPoints} 
                fill={radarColor} 
                fillOpacity="0.2" 
                stroke={radarColor} 
                strokeWidth="2"
                className="transition-all duration-500 ease-out"
            />
            
            {/* 顶点 */}
            {polyPoints.split(' ').map((point, i) => {
                const [x, y] = point.split(',');
                return <circle key={i} cx={x} cy={y} r="3" fill="white" className="transition-all duration-500 ease-out" />
            })}

            {/* 中文标签 */}
            {labels.map((label, i) => {
                 const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                 const x = 150 + Math.cos(angle) * 130;
                 const y = 150 + Math.sin(angle) * 130;
                 return (
                    <text key={i} x={x} y={y} fill="white" fillOpacity="0.8" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                        {label}
                    </text>
                 )
            })}
        </svg>

        {/* 底部实时数值 */}
        <div className="absolute bottom-10 flex gap-8 font-mono text-xs">
            <div className="text-center">
                <div className="text-neutral-500 text-[10px] uppercase">BMI 指数</div>
                <div className={`${val.bmi > 24 ? 'text-red-500' : THEME_TEXT} font-bold text-lg`}>{val.bmi.toFixed(1)}</div>
            </div>
            <div className="text-center">
                <div className="text-neutral-500 text-[10px] uppercase">估算代谢</div>
                <div className="text-white font-bold text-lg">{Math.round(val.bmr)}</div>
            </div>
        </div>
    </div>
  );
};

// --- 3. 交互组件 ---

// 带“未知”开关的滑块组件
interface MetricControlProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  isUnknown: boolean;
  onToggleUnknown: () => void;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
}

const MetricControl = ({ label, value, unit, min, max, isUnknown, onToggleUnknown, onChange, icon }: MetricControlProps) => (
  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-300">
        {icon && <span className={THEME_TEXT}>{icon}</span>}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {/* 未知开关 */}
        <button 
          onClick={onToggleUnknown}
          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${isUnknown ? `${THEME_BG} text-black border-transparent font-bold` : 'text-neutral-500 border-neutral-700 hover:text-white'}`}
        >
          {isUnknown ? '未知' : '已知'}
        </button>
        {/* 数值显示 */}
        {!isUnknown && <span className={`${THEME_TEXT} font-mono font-bold text-xs`}>{value}{unit}</span>}
      </div>
    </div>
    
    {/* 滑块区域 */}
    <div className={`transition-all duration-300 ${isUnknown ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
        <input 
          type="range" min={min} max={max} value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#FF5500] hover:accent-white transition-all"
        />
    </div>
  </div>
);

// 多选按钮组 (用于装备和伤病)
const MultiSelect = ({ options, selected, onChange }: { options: {value: string, label: string}[], selected: string[], onChange: (val: string[]) => void }) => (
    <div className="grid grid-cols-2 gap-2">
        {options.map(opt => {
            const isActive = selected.includes(opt.value);
            return (
                <button
                    key={opt.value}
                    onClick={() => {
                        if (isActive) onChange(selected.filter(v => v !== opt.value));
                        else onChange([...selected, opt.value]);
                    }}
                    className={`p-2 rounded text-[10px] font-bold uppercase border transition-all ${isActive ? `${THEME_BG} text-black border-transparent` : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600'}`}
                >
                    {isActive && <CheckCircle size={10} className="inline mr-1"/>}
                    {opt.label}
                </button>
            )
        })}
    </div>
);

// --- 4. 报告视图 ---
const ReportView = ({ data, onGenerateWorkout, onReset }: { data: DetailedReport | null, onGenerateWorkout: () => void, onReset: () => void }) => {
    if (!data) return null;

    // 辅助组件：章节标题
    const SectionHeader = ({ title, icon: Icon }: any) => (
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b border-white/10 ${THEME_TEXT}`}>
            <Icon size={18} />
            <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
        </div>
    );

    // 辅助组件：数据行
    const DataRow = ({ label, value, sub }: any) => (
        <div className="flex justify-between items-baseline py-1.5 border-b border-white/5 last:border-0">
            <span className="text-neutral-400 text-xs">{label}</span>
            <div className="text-right">
                <span className="font-mono font-bold text-sm text-white">{value}</span>
                {sub && <span className="text-[10px] text-neutral-500 ml-2">{sub}</span>}
            </div>
        </div>
    );

    return (
      <div className="max-w-4xl mx-auto pb-32 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pt-6">
        <div className="flex justify-between items-center mb-8 bg-neutral-900 p-4 rounded-xl border border-white/10">
            <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">身体成分分析报告</h1>
                <div className="text-[10px] text-neutral-500 font-mono">ID: {data.basicInfo.date} / DEVICE: AI-SCANNER</div>
            </div>
            <button onClick={onReset} className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1"><RotateCcw size={14}/> 重测</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. 基础信息 */}
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                <SectionHeader title="基础档案 Basic Info" icon={FileText} />
                <div className="grid grid-cols-2 gap-4">
                    <DataRow label="测试日期" value={data.basicInfo.date} />
                    <DataRow label="测试设备" value={data.basicInfo.device} />
                    <DataRow label="BMI指数" value={data.basicInfo.bmi} sub="kg/m²" />
                    <DataRow label="代谢年龄" value={`${data.metabolic.metabolicAge}岁`} />
                </div>
            </div>

            {/* 2. 身体成分 */}
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                <SectionHeader title="身体成分 Composition" icon={Scale} />
                <DataRow label="体重 Weight" value={data.composition.weight} />
                <DataRow label="体脂率 Body Fat" value={data.composition.fatRate} sub={parseFloat(data.composition.fatRate) > 20 ? '偏高' : '正常'} />
                <DataRow label="骨骼肌 Muscle" value={data.composition.muscleMass} />
                <DataRow label="去脂体重 FFM" value={data.composition.ffm} />
                <DataRow label="内脏脂肪 Visceral" value={`Level ${data.composition.visceralFat}`} />
            </div>

            {/* 3. 代谢与比例 */}
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                <SectionHeader title="代谢分析 Metabolic" icon={Flame} />
                <DataRow label="基础代谢 BMR" value={data.metabolic.bmr} sub="kcal" />
                <DataRow label="建议摄入 TDEE" value={data.metabolic.dailyCalorie} sub="kcal" />
                <div className="mt-4 pt-4 border-t border-white/10">
                    <SectionHeader title="身体比例 Proportion" icon={Ruler} />
                    <DataRow label="腰围 Waist" value={data.proportion.waist} />
                    <DataRow label="腰臀比 WHR" value={data.proportion.whr} sub={parseFloat(data.proportion.whr) > 0.9 ? '中心型肥胖' : '标准'} />
                </div>
            </div>

            {/* 4. 风险评估 */}
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                <SectionHeader title="风险评估 Risk Assess" icon={AlertTriangle} />
                <div className="space-y-4 mt-2">
                    {[
                        { label: '肥胖等级', val: data.risk.obesityLevel, color: data.risk.obesityLevel === '正常' ? 'bg-green-500' : 'bg-red-500' },
                        { label: '内脏脂肪风险', val: data.risk.visceralRisk, color: data.risk.visceralRisk === '低' ? 'bg-green-500' : 'bg-orange-500' },
                        { label: '代谢综合征', val: data.risk.metabolicRisk, color: data.risk.metabolicRisk === '低' ? 'bg-green-500' : 'bg-yellow-500' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1 text-neutral-400"><span>{item.label}</span><span className="text-white">{item.val}</span></div>
                            <div className="w-full h-1.5 bg-neutral-800 rounded-full"><div className={`h-full rounded-full ${item.color}`} style={{width: '60%'}}></div></div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 p-3 bg-white/5 rounded text-xs text-neutral-400 leading-relaxed border-l-2 border-[#FF5500]">
                    {data.goalAnalysis.summary}
                </div>
            </div>

            {/* 5. 行动建议 (占据整行) */}
            <div className="md:col-span-2 bg-gradient-to-r from-[#1C1C1E] to-[#111] p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${THEME_BG}`}></div>
                <SectionHeader title="行动建议 Action Plan" icon={Zap} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 p-3 rounded">
                        <div className="text-[10px] text-neutral-500 uppercase">训练方向</div>
                        <div className={`text-sm font-bold ${THEME_TEXT}`}>{data.action.direction}</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded">
                        <div className="text-[10px] text-neutral-500 uppercase">运动频率</div>
                        <div className="text-sm font-bold text-white">{data.action.frequency}</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded">
                        <div className="text-[10px] text-neutral-500 uppercase">热量控制</div>
                        <div className="text-sm font-bold text-white">{data.action.calorieTarget} kcal</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded">
                        <div className="text-[10px] text-neutral-500 uppercase">蛋白质摄入</div>
                        <div className="text-sm font-bold text-white">{data.action.proteinTarget}</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-center">
            <button 
                onClick={onGenerateWorkout}
                className={`${THEME_BG} text-black font-black uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(255,85,0,0.4)]`}
            >
                <Dumbbell size={20} /> 生成专属训练计划
            </button>
        </div>
      </div>
    );
};

// --- 5. 训练计划视图 (Workout View) ---
const WorkoutView = ({ plan, onBack }: { plan: WorkoutPlan | null, onBack: () => void }) => {
    if (!plan) return null;
    return (
        <div className="max-w-3xl mx-auto pb-24 px-4 pt-6 animate-in slide-in-from-right duration-500">
            <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm font-bold uppercase"><ArrowLeft size={16}/> 返回报告</button>
            
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <div className={`p-6 ${THEME_BG} text-black`}>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">{plan.title}</h1>
                    <div className="flex gap-4 mt-2 font-mono text-xs font-bold opacity-80">
                        <span>⏱ {plan.duration}</span>
                        <span>🔥 {plan.intensity}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                        {plan.tags.map(tag => <span key={tag} className="bg-black/20 text-black text-[10px] font-bold px-2 py-1 rounded">{tag}</span>)}
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* 热身 */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${THEME_TEXT} mb-4 flex items-center gap-2`}><Activity size={16}/> 1. 动态热身 & 激活 Warm-up</h3>
                        <div className="space-y-3">
                            {plan.warmup.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="font-bold text-sm">{item.name}</span>
                                    <div className="text-right">
                                        <div className="font-mono text-xs text-neutral-400">{item.duration}</div>
                                        <div className="text-[10px] text-neutral-600">{item.note}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 正式训练 */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${THEME_TEXT} mb-4 flex items-center gap-2`}><Dumbbell size={16}/> 2. 正式训练 Main Workout</h3>
                        <div className="space-y-4">
                            {plan.main.map((item, i) => (
                                <div key={i} className="bg-white/5 rounded-lg border border-white/5 p-4 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg">{item.name}</span>
                                        <span className={`${THEME_BG} text-black text-[10px] font-bold px-1.5 py-0.5 rounded`}>{item.sets} 组</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400 font-mono mb-2">
                                        <div>Reps: <span className="text-white">{item.reps}</span></div>
                                        <div>Rest: <span className="text-white">{item.rest}</span></div>
                                    </div>
                                    <div className="text-[10px] text-neutral-500 border-t border-white/5 pt-2 mt-2">💡 {item.note}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 拉伸 */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${THEME_TEXT} mb-4 flex items-center gap-2`}><RotateCcw size={16}/> 3. 整理与拉伸 Cool-down</h3>
                        <div className="space-y-3">
                            {plan.cooldown.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="font-bold text-sm text-neutral-300">{item.name}</span>
                                    <span className="font-mono text-xs text-neutral-500">{item.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. 主页面逻辑 ---

export default function FitnessAgentPage() {
  const [view, setView] = useState<ViewState>('scanner');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<DetailedReport | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  // 初始化表单
  const [formData, setFormData] = useState<FormData>({
    name: 'AGENT-01', age: 26, gender: 'male', height: 178, weight: 75,
    bodyFatRate: 18, bodyFatMass: 13.5, skeletalMuscle: 35, bodyWater: 45, bmr: 1750,
    waist: 82, hip: 95,
    unknowns: { bodyFat: false, muscle: false, water: false, bmr: false, waist: false },
    activityLevel: 'moderate', goal: 'loss',
    // 上下文感知字段默认值
    frequency: 3, 
    equipment: ['bodyweight'], 
    injuries: []
  });

  const toggleUnknown = (key: keyof FormData['unknowns']) => {
    setFormData(prev => ({ ...prev, unknowns: { ...prev.unknowns, [key]: !prev.unknowns[key] } }));
  };

  // 模拟 AI 生成详细报告逻辑
  const generateReport = async () => {
    setLoading(true);
    setTimeout(() => {
        // 简单计算逻辑，模拟 AI
        const bmi = (formData.weight / ((formData.height/100)**2)).toFixed(1);
        const whr = (formData.waist / formData.hip).toFixed(2);
        const ffm = (formData.weight * (1 - formData.bodyFatRate/100)).toFixed(1);
        const tdee = Math.round(formData.bmr * 1.55); // 估算
        
        // 模拟 AI 数据
        const mockReport: DetailedReport = {
            basicInfo: { date: new Date().toLocaleDateString(), device: "Bio-Scanner V5", bmi },
            composition: {
                weight: `${formData.weight}kg`,
                fatRate: `${formData.bodyFatRate}%`,
                fatMass: `${(formData.weight * formData.bodyFatRate/100).toFixed(1)}kg`,
                muscleMass: `${formData.skeletalMuscle}kg`,
                ffm: `${ffm}kg`,
                visceralFat: parseFloat(whr) > 0.9 ? 11 : 6, 
                waterRate: `${((formData.bodyWater/formData.weight)*100).toFixed(1)}%`
            },
            proportion: {
                waist: `${formData.waist}cm`,
                whr: whr,
                distributionAnalysis: "脂肪主要堆积在躯干部位，四肢肌肉线条较好。"
            },
            metabolic: {
                bmr: `${formData.bmr}`,
                metabolicAge: formData.age - 2, 
                dailyCalorie: tdee
            },
            risk: {
                obesityLevel: parseFloat(bmi) > 24 ? "超重" : "正常",
                visceralRisk: parseFloat(whr) > 0.9 ? "中等" : "低",
                metabolicRisk: "低"
            },
            goalAnalysis: {
                summary: "当前身体素质基础良好，但体脂率略有上升趋势。骨骼肌含量在正常范围内，有进一步增肌空间。",
                trend: "相比上月，体脂率下降 0.5%，肌肉量保持稳定。"
            },
            action: {
                direction: formData.goal === 'loss' ? "减脂塑形" : "增肌强化",
                frequency: `每周 ${formData.frequency} 练`,
                calorieTarget: `${tdee - 300}`,
                proteinTarget: `${(formData.weight * 2).toFixed(0)}g`,
                reviewCycle: "4 周"
            }
        };
        setReportData(mockReport);
        setView('report');
        setLoading(false);
    }, 2000);
  };

  // 模拟 AI 生成训练计划逻辑 (上下文感知)
  const generateWorkout = () => {
    setLoading(true);
    setTimeout(() => {
        const hasKneeInjury = formData.injuries.includes('knee');
        const isHomeWorkout = !formData.equipment.includes('gym') && !formData.equipment.includes('barbell');
        
        // 动态生成动作列表
        let mainExercises = [];

        // 1. 腿部动作 (根据膝盖伤病调整)
        if (hasKneeInjury) {
            mainExercises.push({ name: "坐姿腿屈伸 (轻重量)", sets: "3", reps: "15-20", rest: "60s", note: "康复动作，避免膝盖压力过大" });
            mainExercises.push({ name: "臀桥 (Glute Bridge)", sets: "4", reps: "20", rest: "60s", note: "强化臀部，保护膝盖" });
        } else {
            mainExercises.push({ name: isHomeWorkout ? "自重深蹲" : "杠铃深蹲", sets: "4", reps: "12", rest: "90s", note: "核心收紧，膝盖对准脚尖" });
        }

        // 2. 推类动作 (根据场地调整)
        if (isHomeWorkout) {
            mainExercises.push({ name: "标准俯卧撑", sets: "4", reps: "力竭", rest: "60s", note: "大臂与身体呈45度" });
        } else {
            mainExercises.push({ name: "哑铃/杠铃卧推", sets: "4", reps: "10-12", rest: "90s", note: "控制离心过程" });
        }

        // 3. 拉类动作
        mainExercises.push({ name: isHomeWorkout ? "弹力带划船 / 引体向上" : "高位下拉", sets: "4", reps: "12", rest: "60s", note: "收紧肩胛骨" });
        
        // 4. 肩部动作
        mainExercises.push({ name: "哑铃侧平举", sets: "3", reps: "15", rest: "45s", note: "肘部微屈，不要耸肩" });

        // 5. 核心动作
        mainExercises.push({ name: "平板支撑", sets: "3", reps: "60s", rest: "45s", note: "保持身体呈一条直线" });

        const plan: WorkoutPlan = {
            title: isHomeWorkout ? "居家自重强化训练" : "健身房综合力量训练",
            duration: "60-75 分钟",
            intensity: "中高强度 (RPE 7-8)",
            tags: [
                isHomeWorkout ? "居家" : "器械", 
                hasKneeInjury ? "膝盖友好" : "全身综合",
                formData.goal === 'loss' ? "高消耗" : "肌肥大"
            ],
            warmup: [
                { name: "关节活动 (颈/肩/髋/膝/踝)", duration: "3 分钟", note: "缓慢绕环，避免弹震" },
                { name: "开合跳 / 原地小跑", duration: "2 分钟", note: "提升心率至 110bpm" },
                { name: "死虫式 (Deadbug)", duration: "2 组 x 30秒", note: "激活核心，保持腰部贴地" }
            ],
            main: mainExercises,
            cooldown: [
                { name: "胸大肌拉伸", duration: "30秒/侧", note: "扶墙进行" },
                { name: "大腿后侧拉伸", duration: "30秒/侧", note: "坐姿体前屈" },
                { name: "泡沫轴放松 (大腿外侧)", duration: "1 分钟", note: "寻找痛点停留" }
            ]
        };
        setWorkoutPlan(plan);
        setView('workout');
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5500] selection:text-black flex flex-col overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <nav className="p-6 flex justify-between items-center sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={20}/> <span className="font-bold text-xs uppercase tracking-widest hidden md:inline">退出</span>
        </Link>
        <div className={`font-mono text-xs ${THEME_TEXT} animate-pulse`}>FITNESS AGENT V2.0</div>
        <div className="w-10"></div>
      </nav>

      {/* 1. 扫描界面 */}
      {view === 'scanner' && !loading && (
          <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
            {/* 左侧：任务配置 */}
            <aside className="w-full md:w-1/4 p-6 border-r border-white/5 bg-black/50 overflow-y-auto">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-2"><Settings size={14}/> 任务环境设定</h2>
                
                <div className="space-y-6">
                    <div>
                        <div className="text-[10px] font-bold uppercase text-neutral-400 mb-2">现有装备 (Equipment)</div>
                        <MultiSelect 
                            options={[{value:'bodyweight', label:'徒手'}, {value:'dumbbell', label:'哑铃'}, {value:'barbell', label:'杠铃'}, {value:'gym', label:'健身房'}]}
                            selected={formData.equipment}
                            onChange={(val) => setFormData({...formData, equipment: val})}
                        />
                    </div>

                    <div>
                        <div className="text-[10px] font-bold uppercase text-neutral-400 mb-2">伤病回避 (Injuries)</div>
                        <MultiSelect 
                            options={[{value:'knee', label:'膝盖痛'}, {value:'back', label:'腰痛'}, {value:'shoulder', label:'肩痛'}, {value:'wrist', label:'手腕痛'}]}
                            selected={formData.injuries}
                            onChange={(val) => setFormData({...formData, injuries: val})}
                        />
                    </div>

                    <div>
                        <div className="text-[10px] font-bold uppercase text-neutral-400 mb-2">周训练频率: {formData.frequency} 天</div>
                        <input type="range" min={1} max={7} value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: parseInt(e.target.value)})} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#FF5500]" />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                         <div className="text-[10px] font-bold uppercase text-neutral-400 mb-2">代号 Name</div>
                         <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-neutral-800 text-white font-mono py-1 focus:outline-none focus:border-[#FF5500]" />
                    </div>
                </div>
            </aside>

            {/* 中间：雷达 */}
            <section className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden border-r border-white/5">
                <BioRadar formData={formData} />
                <div className="absolute bottom-8 left-0 w-full flex justify-center px-4">
                    <button onClick={generateReport} className={`${THEME_BG} text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,85,0,0.3)] flex items-center gap-2 text-sm z-20`}>
                        启动全维分析 <ChevronRight size={16} />
                    </button>
                </div>
            </section>

            {/* 右侧：身体指标 */}
            <aside className="w-full md:w-1/4 p-6 bg-black/50 overflow-y-auto">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-2"><Activity size={14}/> 生物指标录入</h2>
                <div className="space-y-4">
                    <MetricControl label="身高" value={formData.height} unit="CM" min={140} max={220} isUnknown={false} onToggleUnknown={()=>{}} onChange={(v:number) => setFormData({...formData, height: v})} />
                    <MetricControl label="体重" value={formData.weight} unit="KG" min={40} max={150} isUnknown={false} onToggleUnknown={()=>{}} icon={<Scale size={14}/>} onChange={(v:number) => setFormData({...formData, weight: v})} />
                    <MetricControl label="腰围" value={formData.waist} unit="CM" min={50} max={120} isUnknown={formData.unknowns.waist} onToggleUnknown={() => toggleUnknown('waist')} icon={<Ruler size={14}/>} onChange={(v:number) => setFormData({...formData, waist: v})} />
                    <MetricControl label="臀围" value={formData.hip} unit="CM" min={50} max={120} isUnknown={false} onToggleUnknown={()=>{}} onChange={(v:number) => setFormData({...formData, hip: v})} />
                    <MetricControl label="体脂率" icon={<Zap size={14}/>} unit="%" min={5} max={50} value={formData.bodyFatRate} isUnknown={formData.unknowns.bodyFat} onToggleUnknown={() => toggleUnknown('bodyFat')} onChange={(v:number) => setFormData({...formData, bodyFatRate: v})} />
                    <MetricControl label="骨骼肌" icon={<Dumbbell size={14}/>} unit="KG" min={20} max={60} value={formData.skeletalMuscle} isUnknown={formData.unknowns.muscle} onToggleUnknown={() => toggleUnknown('muscle')} onChange={(v:number) => setFormData({...formData, skeletalMuscle: v})} />
                    <MetricControl label="基础代谢" icon={<Flame size={14}/>} unit="Kcal" min={1000} max={3000} value={formData.bmr} isUnknown={formData.unknowns.bmr} onToggleUnknown={() => toggleUnknown('bmr')} onChange={(v:number) => setFormData({...formData, bmr: v})} />
                </div>
            </aside>
          </main>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 size={64} className={`animate-spin ${THEME_TEXT} mb-8`} />
            <h2 className="text-3xl font-bold uppercase animate-pulse tracking-widest">系统运算中</h2>
            <p className="text-neutral-500 font-mono mt-2 text-xs">PROCESSING CONTEXT & BIOMETRICS...</p>
        </div>
      )}

      {/* 2. 报告界面 */}
      {view === 'report' && !loading && (
          <ReportView data={reportData} onGenerateWorkout={generateWorkout} onReset={() => setView('scanner')} />
      )}

      {/* 3. 训练计划界面 */}
      {view === 'workout' && !loading && (
          <WorkoutView plan={workoutPlan} onBack={() => setView('report')} />
      )}
    </div>
  );
}
