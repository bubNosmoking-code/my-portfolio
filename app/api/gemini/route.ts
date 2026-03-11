import { NextRequest, NextResponse } from 'next/server';
import { ProxyAgent } from 'undici';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const dispatcher = new ProxyAgent('http://127.0.0.1:7890'); // 改成你的代理端口

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
      // @ts-ignore
      dispatcher,
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}