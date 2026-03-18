"use client";

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Menu, Mail, FileText, Download } from 'lucide-react';

export default function Home() {
  const [wechatOpen, setWechatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#111111] font-serif selection:bg-black selection:text-white">
      {/* 样式注入 */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@400&family=Playfair+Display:ital,wght@0,400;0,600;0,900;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        
        :root {
            --bg-color: #F9F9F7;
            --ink-color: #111111;
            --accent-color: #CC0000;
        }

        * { border-radius: 0px !important; }
        body, html {
            cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L11.5 22L14.5 13L22 9L2 2Z" fill="black" stroke="white" stroke-width="2"/></svg>') 2 2, auto;
        }
        a, button, .cursor-pointer {
            cursor: crosshair !important; 
        }
        a:hover, button:hover {
            color: #CC0000; 
        }
        body {
            background-color: var(--bg-color);
            color: var(--ink-color);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23111111' fill-opacity='0.04' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
            font-family: 'Lora', serif;
        }
        .font-headline { font-family: 'Playfair Display', serif; }
        .font-sans-ui { font-family: 'Inter', sans-serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }
        .hover-lift {
            transition: all 0.2s ease-out;
        }
        .hover-lift:hover {
            transform: translate(-4px, -4px);
            box-shadow: 6px 6px 0px 0px #111111;
            background-color: white;
        }
        .mega-text {
            font-size: clamp(2.5rem, 9vw, 10rem);
            line-height: 1;
        }
        .drop-cap::first-letter {
            float: left;
            font-family: 'Playfair Display', serif;
            font-size: 5rem;
            line-height: 0.8;
            font-weight: 700;
            margin-right: 0.5rem;
            margin-top: 0.5rem;
        }
        @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-ticker {
            display: inline-block;
            animation: ticker 35s linear infinite;
        }
        #ticker:hover .animate-ticker {
            animation-play-state: paused;
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>

      <Script src="https://cdn.tailwindcss.com" />

      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 border-b border-black bg-[#F9F9F7] px-4 py-3 flex justify-between items-center">
        <div className="font-headline font-bold text-xl tracking-tight">BN.</div>
        <div className="hidden md:flex gap-6 font-mono-data text-xs uppercase tracking-widest items-center">
            <a href="#intro" className="hover:underline decoration-[#CC0000] underline-offset-4">Intro</a>
            <a href="#projects" className="hover:underline decoration-[#CC0000] underline-offset-4">Projects</a>
            <a href="#lab" className="hover:underline decoration-[#CC0000] underline-offset-4">Lab</a>
            <a href="/resume.pdf" download className="bg-black text-white px-2 py-1 hover:bg-[#CC0000] transition-colors flex items-center gap-1 group">
                <FileText size={10} className="group-hover:animate-bounce" />
                RESUME [PDF]
            </a>
        </div>
        <button className="md:hidden">
            <Menu className="w-6 h-6" />
        </button>
      </nav>

      <div className="max-w-screen-xl mx-auto border-x border-black min-h-screen">

        {/* Header */}
        <header className="border-b-4 border-black py-12 md:py-24 text-center overflow-hidden relative">
            <div className="absolute top-4 left-0 w-full flex justify-between px-6 opacity-50 font-mono-data text-[10px] uppercase">
                <span>Fig 1.1 — Portfolio</span>
                <span>Est. 2026</span>
            </div>
            <h1 className="mega-text font-headline font-black tracking-tighter whitespace-nowrap px-4 mt-8">
                bubNosmoking
            </h1>
            <p className="mt-6 font-mono-data text-sm md:text-base uppercase tracking-widest text-neutral-600">
                Growth Operator &bull; Brand Builder &bull; AI-Powered Marketer
            </p>
        </header>

        {/* Intro Section */}
        <section id="intro" className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-black p-8 flex flex-col items-center justify-center bg-white">
                <div className="w-48 h-64 border border-black bg-neutral-100 flex items-center justify-center overflow-hidden mb-6 relative">
                    <img src="images/about-me-2.jpg" 
                         className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                         alt="Profile" />
                    <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none"></div>
                </div>
                <div className="text-center">
                    <h3 className="font-headline text-2xl font-bold">About Me</h3>
                    <p className="font-mono-data text-xs mt-2 text-neutral-500">BASED IN SHENZHEN</p>
                </div>
            </div>

            <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-center">
                <div className="font-mono-data text-xs uppercase tracking-widest mb-4 text-[#CC0000]">Editorial / 01</div>
                <p className="drop-cap text-lg md:text-xl leading-relaxed text-justify mb-6">
                    你好，我是 bub。我做产品出海，做内容，跑增长。AI 出现之后，我开始用它重新做一遍我已经会的事——发现很多事情可以做得更好，也发现有些事情 AI 其实做不了。这个过程让我有很多想说的话。
                </p>
                <p className="text-lg leading-relaxed text-justify text-neutral-700">
                    这个网站是我放东西的地方。有我用 AI 做的一些小工具，都是因为自己用得上才做的。有一些视觉实验，Three.js 的、Canvas 的，纯粹觉得好玩。也有一些文字，关于 AI 在真实工作里的样子，以及我自己还没完全想清楚的一些问题。欢迎逛逛。
                </p>
                
                <div className="mt-8 pt-8 border-t border-dashed border-black w-full flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        {/* WeChat */}
                        <button
                            onClick={() => setWechatOpen(true)}
                            className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.06-6.122h-.002zm-3.423 3.293c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                            </svg>
                            WeChat
                        </button>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com/bubnosmoking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                            </svg>
                            Instagram
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:weiqilunbub@gmail.com"
                            className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <Mail size={14} />
                            Email
                        </a>
                    </div>

                    <a href="/resume.pdf" download="bubNosmoking_Resume.pdf" className="group block w-full bg-[#111111] text-[#F9F9F7] border border-black p-4 hover:bg-[#CC0000] hover:text-white transition-all relative overflow-hidden text-center cursor-pointer">
                        <div className="flex justify-between items-center relative z-10 px-2">
                            <div className="flex items-center gap-3">
                                <div className="border border-white/30 p-1">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left leading-tight">
                                    <span className="block font-headline font-bold text-lg">FULL DOSSIER</span>
                                    <span className="block font-mono-data text-[10px] uppercase tracking-widest opacity-70">Confidential / PDF Format</span>
                                </div>
                            </div>
                            <span className="font-sans-ui text-xs font-bold uppercase group-hover:translate-x-1 transition-transform flex items-center gap-2">
                                Download <Download size={14} />
                            </span>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        {/* Ticker Section */}
        <section id="ticker" className="border-b border-black bg-white py-2 overflow-hidden flex items-center">
            <div className="px-4 border-r border-black bg-black text-white z-10 flex items-center gap-2 shrink-0 h-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC0000] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC0000]"></span>
                </span>
                <span className="font-mono-data text-[10px] font-bold tracking-tighter uppercase">Breaking News</span>
            </div>
            <div className="flex whitespace-nowrap overflow-hidden bg-white text-black w-full">
                <div className="inline-block animate-ticker font-mono-data text-xs uppercase tracking-[0.2em] py-1">
                    <span className="mx-8 text-[#CC0000]">●</span>
                    50篇技术文章 · 10个关键词进 Google 首页
                    <span className="mx-8 text-[#CC0000]">●</span>
                    SEO / GEO · Perplexity · ChatGPT Search
                    <span className="mx-8 text-[#CC0000]">●</span>
                    5个独立站 · 建站周期1-2周
                    <span className="mx-8 text-[#CC0000]">●</span>
                    Claude · Gemini · 一人顶一个团队
                    <span className="mx-8 text-[#CC0000]">●</span>
                    LLM / RAG / Agent · 能读 API 文档
                    <span className="mx-8 text-[#CC0000]">●</span>
                    Content Evangelist · 深圳 · 可远程
                    <span className="mx-8 text-[#CC0000]">●</span>
                    50篇技术文章 · 10个关键词进 Google 首页
                    <span className="mx-8 text-[#CC0000]">●</span>
                    SEO / GEO · Perplexity · ChatGPT Search
                    <span className="mx-8 text-[#CC0000]">●</span>
                    5个独立站 · 建站周期1-2周
                    <span className="mx-8 text-[#CC0000]">●</span>
                    Claude · Gemini · 一人顶一个团队
                    <span className="mx-8 text-[#CC0000]">●</span>
                    LLM / RAG / Agent · 能读 API 文档
                    <span className="mx-8 text-[#CC0000]">●</span>
                    Content Evangelist · 深圳 · 可远程
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="border-b border-black bg-white">
            <div className="p-4 border-b border-black bg-[#111111] text-[#F9F9F7] flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">Market Data: Technical Index</h2>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline font-mono-data text-[10px] animate-pulse">● LIVE DATA FEED</span>
                    <span className="font-mono-data text-xs">VOL: 2026.02</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
    <div className="border-b md:border-b-0 md:border-r border-black">
        <div className="p-2 border-b border-black bg-neutral-100 font-mono-data text-[10px] font-bold uppercase tracking-widest text-center">
            Sector: Growth & Content Operations
        </div>
        <table className="w-full font-mono-data text-xs">
            <thead>
                <tr className="border-b border-black text-[10px] uppercase">
                    <th className="p-2 text-left border-r border-black">Asset</th>
                    <th className="p-2 text-left border-r border-black">Strength</th>
                    <th className="p-2 text-right">Trend</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">SHOPIFY</td>
                    <td className="p-2 border-r border-black text-neutral-500">++++++--</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 92.0</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">GOOGLE ADS</td>
                    <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 85.0</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">SEO / GEO</td>
                    <td className="p-2 border-r border-black text-neutral-500">+++++++−</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 95.0</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="border-b md:border-b-0 md:border-r border-black">
        <div className="p-2 border-b border-black bg-neutral-100 font-mono-data text-[10px] font-bold uppercase tracking-widest text-center">
            Sector: AI Tooling & Creation
        </div>
        <table className="w-full font-mono-data text-xs">
            <thead>
                <tr className="border-b border-black text-[10px] uppercase">
                    <th className="p-2 text-left border-r border-black">Asset</th>
                    <th className="p-2 text-left border-r border-black">Strength</th>
                    <th className="p-2 text-right">Trend</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">PROMPT ENG</td>
                    <td className="p-2 border-r border-black text-neutral-500">++++++--</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 90.1</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">VIBE CODING</td>
                    <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 85.0</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                    <td className="p-2 border-r border-black font-bold">LLM / RAG / AGENT</td>
                    <td className="p-2 border-r border-black text-neutral-500">++++----</td>
                    <td className="p-2 text-right text-[#CC0000]">▲ 82.0</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="p-6 flex flex-col justify-between">
        <div>
            <h4 className="font-headline font-bold text-lg mb-2 underline decoration-1 decoration-black">Analyst Note / 专家评级</h4>
            <p className="font-body text-xs text-justify leading-tight text-neutral-600">
                该候选人具备<span className="text-black font-bold">「真实业务经验 × AI 落地能力」</span>的稀缺复合背景。3年+ 海外内容营销经验覆盖独立站全链路，深度实践 GEO 优化与 LLM 内容工作流重构，能以开发者视角创作技术内容。对 RAG、Agent、API 集成等 GenAI 方向保持高密度关注，具备与工程团队同频沟通的能力。适合需要同时理解产品技术逻辑与全球内容分发的 Content Evangelist 岗位。
            </p>
        </div>
        <div className="mt-6 pt-4 border-t border-black">
            <div className="flex justify-between items-end">
                <div>
                    <div className="font-mono-data text-[10px] uppercase">Confidence Score</div>
                    <div className="font-headline text-3xl font-black">9.41</div>
                </div>
                <div className="text-right">
                    <div className="font-mono-data text-[10px] uppercase text-[#CC0000]">Rating</div>
                    <div className="font-headline text-2xl font-bold italic text-[#CC0000]">STRONG BUY</div>
                </div>
            </div>
        </div>
    </div>
</div>

            <div className="border-t border-black p-1 bg-neutral-50 overflow-hidden whitespace-nowrap">
                <div className="inline-block font-mono-data text-[10px] animate-[scroll_20s_linear_infinite]">
                    SHOPIFY +4.1% | META ADS +2.8% | PROMPT ENG +9.9% | TIKTOK +6.3% | BUB +9.9% | AI × 出海 +100% | 
                    SHOPIFY +4.1% | META ADS +2.8% | PROMPT ENG +9.9% | TIKTOK +6.3% | BUB +9.9% | AI × 出海 +100%
                </div>
            </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="border-b border-black">
            <div className="p-4 border-b border-black bg-[#111111] text-[#F9F9F7] flex justify-between items-center">
    <h2 className="font-headline text-3xl font-bold uppercase">AI · Projects</h2>
                <span className="font-mono-data text-xs">(2025 — 2026)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <Link href="/projects/fitness-agent">
                    <article className="group border-b md:border-r border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                        <div className="w-full h-48 border border-black mb-6 overflow-hidden relative group">
    <div className="absolute inset-0 bg-[#F9F9F7] transition-opacity duration-500 group-hover:opacity-0 p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <span className="font-mono-data text-[9px] text-black/30 tracking-widest uppercase">Iron Press · 01</span>
            <span className="font-mono-data text-[9px] text-[#CC0000] tracking-widest uppercase">AGENT</span>
        </div>
        <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2">
            <div className="font-headline text-[4.5rem] font-black leading-none tracking-tighter text-neutral-200 select-none" style={{fontFamily:"'Playfair Display',serif"}}>IRON<br/>PRESS</div>
        </div>
        <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
                {[48,32,56,24].map((w,i) => (
                    <div key={i} style={{width:w}} className={`h-px ${i===0?"bg-[#CC0000]":"bg-black/15"}`} />
                ))}
            </div>
            <div className="w-6 h-6 border border-black/20 rotate-45" />
        </div>
    </div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img src="/images/cover-ironpress.png" className="w-full h-full object-cover" />
    </div>
</div>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">Iron Press</h3>
                            <span className="font-mono-data text-xs border border-black px-1 rounded-none">AGENT</span>
                        </div>
                        <p className="font-body text-neutral-600 line-clamp-3 mb-4">
                            个人健身管理 AI Agent。用 Genimi API 驱动，支持训练计划生成、动作解析与进度追踪。这是我第一个完整项目，从 Prompt 设计到界面搭建全程独立完成。
                        </p>
                        <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">VIEW CASE STUDY &rarr;</span>
                    </article>
                </Link>

                <Link href="/projects/overseas-case">
                <article className="group border-b border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                    <div className="w-full h-48 border border-black mb-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-[#F9F9F7] transition-opacity duration-500 group-hover:opacity-0">
        <span className="absolute right-2 top-0 font-headline text-[6.5rem] font-black leading-none text-black/[0.04] select-none" style={{fontFamily:"'Playfair Display',serif"}}>出海</span>
        <div className="absolute left-5 top-5 font-mono-data text-[9px] text-black/25 tracking-widest uppercase">Overseas · 02</div>
        <div className="absolute bottom-5 right-5 font-mono-data text-[9px] text-[#CC0000] tracking-widest">BRAND BUILDING</div>
        <div className="absolute left-5 bottom-5 flex gap-2 items-end">
            <div className="w-7 h-7 bg-[#111111]" />
            <div className="w-7 h-7 border border-black/40" />
            <div className="w-7 h-7 bg-[#CC0000]" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-headline text-5xl font-black italic text-black/[0.06]" style={{fontFamily:"'Playfair Display',serif"}}>02</div>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-px h-12 bg-black/10" />
    </div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img src="/images/cover-overseas.png" className="w-full h-full object-cover" />
    </div>
</div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">GEO press generator</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">BRAND BUILDING</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">
                        SEO/GEO 文章批量生成工具。输入关键词与品牌信息，自动产出符合 Google 与 AI 搜索引擎（Perplexity、ChatGPT Search）收录标准的长文内容。
                    </p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
                </Link>

                 <Link href="/projects/contentflow">
                 <article className="group border-b md:border-r border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                  <div className="w-full h-48 border border-black mb-6 overflow-hidden relative group">
    <div className="absolute inset-0 bg-[#F9F9F7] transition-opacity duration-500 group-hover:opacity-0 p-5 flex flex-col justify-between">
        <div className="absolute inset-0" style={{backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(0,0,0,0.025) 40px,rgba(0,0,0,0.025) 41px),repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(0,0,0,0.025) 40px,rgba(0,0,0,0.025) 41px)"}} />
        <div className="flex justify-between items-start">
            <span className="font-mono-data text-[9px] text-black/30 tracking-widest uppercase">ContentFlow · 03</span>
            <span className="font-mono-data text-[9px] text-[#CC0000] tracking-widest uppercase">AUTO</span>
        </div>
        <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2">
            <div className="font-headline font-black leading-none tracking-tighter text-neutral-200 select-none" style={{fontFamily:"'Playfair Display',serif", fontSize:"4.2rem"}}>CONTENT<br/>FLOW</div>
        </div>
        <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
                {[56,100,36,76,56,88].map((w,i) => (
                    <div key={i} style={{width:w*0.6}} className={`h-[2px] ${i===1?"bg-[#CC0000]/60":"bg-black/10"}`} />
                ))}
            </div>
            <div className="font-mono-data text-[9px] text-black/15">■ □ ■</div>
        </div>
</div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img src="/images/cover-contentflow.png" className="w-full h-full object-cover" />
    </div>
</div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">ContentFlow</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">AUTOMATION</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">用 AI 重构社媒运营工作流：从竞品监控、内容选题到多平台发布，将原本需要 3 人团队的工作压缩为单人可执行的半自动化流程。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
                </Link>  

                <Link href="/projects/campaign-decoder">
                <article className="group border-b border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                   <div className="w-full h-48 border border-black mb-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-[#F9F9F7] transition-opacity duration-500 group-hover:opacity-0">
        <div className="absolute inset-0" style={{backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(17,17,17,0.025) 10px,rgba(17,17,17,0.025) 11px)"}} />
        <span className="absolute left-3 top-0 font-headline text-[7rem] font-black leading-none text-black/[0.04] select-none" style={{fontFamily:"'Playfair Display',serif"}}>D.</span>
        <div className="absolute left-5 top-5 font-mono-data text-[9px] text-black/25 tracking-widest uppercase">Dissect · 04</div>
        <div className="absolute bottom-5 right-5 font-mono-data text-[9px] text-[#CC0000] tracking-widest">DECODER</div>
        <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#CC0000]" />
            <div className="w-14 h-px bg-black/15" />
            <div className="w-2 h-2 border border-black/20 rotate-45" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-headline text-xl font-black italic text-black/[0.08] tracking-wider" style={{fontFamily:"'Playfair Display',serif"}}>DECODE<br/>REBUILD<br/>REPEAT</div>
    </div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <img src="/images/cover-dissect.png" className="w-full h-full object-cover" />
    </div>
</div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">Dissect</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">AGENT</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">
                        广告创意解剖工具。输入任意广告文案，AI 从心理机制、情绪弧线、叙事结构、受众定位、钩子逻辑五个维度拆解，并将同一框架移植重建为你的品牌版本。
                    </p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
                </Link>
            </div>
        </section>

{/* Lab Section */}
<section id="lab" className="border-b border-black bg-white">
    <div className="p-4 border-b border-black bg-[#111111] text-[#F9F9F7] flex justify-between items-center">
    <div>
        <h2 className="font-headline text-3xl font-bold uppercase tracking-tight">Lab / 实验田</h2>
        <p className="font-mono-data text-[10px] text-white/30 mt-1 tracking-widest uppercase">Tools · Code · Design · Art</p>
    </div>
    <span className="font-mono-data text-[10px] text-white/20 italic">5 objects</span>
</div>

    <div className="grid grid-cols-4 border-black">

        <div className="col-span-2 row-span-2 border-r border-b border-black group overflow-hidden relative" style={{minHeight: 480}}>
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="font-mono-data text-[9px] bg-[#CC0000] text-white px-2 py-0.5 tracking-widest uppercase">TOOL</span>
                <span className="font-mono-data text-[9px] text-white/30 tracking-widest uppercase">01</span>
            </div>
<div className="absolute inset-0 bg-[#F9F9F7] transition-opacity duration-500 group-hover:opacity-0 flex flex-col justify-between p-6">
    <div className="flex justify-between items-start">
        <span className="font-mono-data text-[9px] text-black/30 tracking-widest uppercase">Image Lab · Browser-based</span>
        <span className="font-mono-data text-[9px] text-[#CC0000] tracking-widest uppercase">TOOL · 01</span>
    </div>
    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
        <div className="font-headline font-black leading-none tracking-tighter text-black/06 select-none" style={{fontFamily:"'Playfair Display',serif", fontSize:"7rem"}}>DARK<br/>ROOM</div>
    </div>
    <div className="flex items-end justify-between">
    <div className="flex flex-col gap-1.5">
        {[80,48,96,32,64].map((w,i) => (
            <div key={i} style={{width:w}} className={`h-px ${i===0?"bg-[#CC0000]/50":"bg-black/12"}`} />
        ))}
    </div>
    <div className="text-right">
        <div className="font-headline text-2xl font-black italic text-black/50" style={{fontFamily:"'Playfair Display',serif"}}>Dark<span style={{color:"#CC0000"}}>room</span></div>
        <div className="font-mono-data text-[9px] text-black/25 tracking-widest mt-1 uppercase">Develop · Crop · Export</div>
        <div className="font-body text-[11px] text-black/35 mt-2 max-w-[200px] text-right leading-relaxed">
            浏览器端图像处理工具，支持滤镜、裁剪与多格式导出
        </div>
    </div>
</div>
</div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <img src="/images/cover-darkroom.png" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-6 right-6 z-20">
                <a href="/projects/darkroom" className="font-mono-data text-[9px] bg-black text-white px-3 py-2 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 inline-block">
                    Open Lab →
                </a>
            </div>
            <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => window.location.href='/projects/darkroom'} />
        </div>

<div className="col-span-1 border-r border-b border-black group overflow-hidden relative bg-[#f0ede6]" style={{aspectRatio:"1/1"}}>
    <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="font-mono-data text-[9px] bg-[#111111] text-white px-2 py-0.5 tracking-widest uppercase">CODE</span>
        <span className="font-mono-data text-[9px] text-black/25 tracking-widest uppercase">02</span>
    </div>
<iframe
    src="/receipt-ui.html"
    className="absolute inset-0 w-full h-full border-none transition-all duration-500"
    style={{
        pointerEvents: "none",
        filter: "grayscale(100%) brightness(0.9)",
    }}
    onMouseEnter={e => {
        e.currentTarget.style.pointerEvents = "auto";
        e.currentTarget.style.filter = "grayscale(0%) brightness(1)";
    }}
    onMouseLeave={e => {
        e.currentTarget.style.pointerEvents = "none";
        e.currentTarget.style.filter = "grayscale(100%) brightness(0.9)";
    }}
    title="Receipt UI"
/>
    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 border-t border-black pointer-events-none">
        <div className="flex justify-between items-end">
            <div>
                <div className="font-headline text-sm font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Receipt UI</div>
                <div className="font-mono-data text-[9px] text-black/40 tracking-widest uppercase">Three.js · Verlet Physics</div>
            </div>
            <a href="/projects/receipt-ui" className="font-mono-data text-[9px] bg-black text-white px-2 py-1 tracking-widest uppercase pointer-events-auto">
                Full →
            </a>
        </div>
    </div>
</div>

        <div className="col-span-1 border-b border-black group overflow-hidden relative" style={{aspectRatio:"1/1"}}>
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="font-mono-data text-[9px] bg-[#CC0000] text-white px-2 py-0.5 tracking-widest uppercase">DESIGN</span>
                <span className="font-mono-data text-[9px] text-white/50 tracking-widest uppercase">03</span>
            </div>
            <img
                src="/images/lab-collage.jpg"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 border-t border-black">
                <div className="font-headline text-sm font-bold" style={{fontFamily:"'Playfair Display',serif"}}>剪贴画</div>
                <div className="font-mono-data text-[9px] text-black/40 tracking-widest uppercase">Collage · Mixed Media</div>
            </div>
        </div>

        <div className="col-span-1 border-r border-black group overflow-hidden relative" style={{aspectRatio:"4/3"}}>
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="font-mono-data text-[9px] border border-black/30 text-black/40 px-2 py-0.5 tracking-widest uppercase bg-white/80">ART</span>
                <span className="font-mono-data text-[9px] text-black/25 tracking-widest uppercase">04</span>
            </div>
            <img
                src="/images/lab-installation-01.jpg"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(0deg,transparent_1px,#000_1px)] [background-size:100%_3px]" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 border-t border-black">
                <div className="font-headline text-sm font-bold" style={{fontFamily:"'Playfair Display',serif"}}>装置艺术 I</div>
                <div className="font-mono-data text-[9px] text-black/40 tracking-widest uppercase">Installation · Photography</div>
            </div>
        </div>

        <div className="col-span-1 border-black group overflow-hidden relative" style={{aspectRatio:"4/3"}}>
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="font-mono-data text-[9px] border border-black/30 text-black/40 px-2 py-0.5 tracking-widest uppercase bg-white/80">ART</span>
                <span className="font-mono-data text-[9px] text-black/25 tracking-widest uppercase">05</span>
            </div>
            <img
                src="/images/lab-installation-02.jpg"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(0deg,transparent_1px,#000_1px)] [background-size:100%_3px]" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 border-t border-black">
                <div className="font-headline text-sm font-bold" style={{fontFamily:"'Playfair Display',serif"}}>装置艺术 II</div>
                <div className="font-mono-data text-[9px] text-black/40 tracking-widest uppercase">Installation · Photography</div>
            </div>
        </div>
</div>
</section>

        {/* Works Section */}
        <section id="works" className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-black p-8 bg-[#F9F9F7] text-[#111111]">
    <h2 className="font-headline text-4xl font-bold mb-4">Works &<br/>Thoughts</h2>
    <p className="font-body text-sm text-neutral-600 mb-8">
        这里存档了我的文章&随笔。
    </p>
    <div className="w-8 h-1 bg-[#CC0000] mb-8"></div>
    <div className="font-mono-data text-xs uppercase tracking-widest text-black/40">
        Last Update: <br/>Mar 13, 2026
    </div>
</div>

            <div className="md:col-span-9 bg-white">
                <a href="/works/ai-journey" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">ESSAY</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            我不是技术人，但我比大多数技术人更早想清楚了一件事
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-03-10</span>
                </a>

                <a href="/works/prompt-skill" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">ESSAY</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            你没在用 AI，你在让 AI 哄你——以及如何真正让它为你工作

                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-03-12</span>
                </a>

                <a href="/works/vibe-coding" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">ESSAY</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            Vibe Coding 六个月：它是真实的生产力，但门槛不在你以为的地方
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-02-25</span>
                </a>
                
                <div className="p-6 text-center">
                    <button className="font-sans-ui text-sm font-bold uppercase tracking-widest border-b-2 border-black hover:bg-black hover:text-white transition-all pb-1">
                        View Archive
                    </button>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-black p-8 md:p-12 bg-[#F9F9F7] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="font-headline text-2xl font-bold mb-4">bubNosmoking</h2>
                <p className="font-mono-data text-xs text-neutral-500 uppercase tracking-widest max-w-xs">
                    Built by a growth operator who got tired of waiting for developers.<br/>Powered by Claude + Cursor + Next.js.
                </p>
            </div>
            <div className="flex flex-col md:items-end justify-between">
                <div className="flex gap-4 mb-4">
                    {/* WeChat */}
                    <button
                        onClick={() => setWechatOpen(true)}
                        className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.06-6.122h-.002zm-3.423 3.293c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                        </svg>
                    </button>

                    {/* Instagram */}
                    <a
                        href="https://instagram.com/bubnosmoking"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:weiqilunbub@gmail.com"
                        className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                </div>
                <p className="font-mono-data text-[10px] text-neutral-400">© 2026 ALL RIGHTS RESERVED.</p>
            </div>
        </footer>

      </div>

      {/* WeChat 二维码弹窗 */}
      {wechatOpen && (
          <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setWechatOpen(false)}
          >
              <div
                  className="bg-white border border-black p-8 flex flex-col items-center gap-4 relative"
                  onClick={e => e.stopPropagation()}
              >
                  <div className="font-mono-data text-[10px] tracking-widest uppercase text-black/40">扫码添加微信</div>
                  <img
                      src="/images/wechat-qr.jpg"
                      alt="WeChat QR Code"
                      className="w-48 h-48 object-contain"
                  />
                  <div className="font-mono-data text-[10px] tracking-widest text-black/30">weiqilunbub</div>
                  <button
                      onClick={() => setWechatOpen(false)}
                      className="absolute top-3 right-3 font-mono-data text-[11px] text-black/30 hover:text-black transition-colors"
                  >
                      ✕
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}
