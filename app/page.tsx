"use client";

import Link from 'next/link';
import Script from 'next/script';
import { Menu, Twitter, Github, Mail, FileText, Download } from 'lucide-react';

export default function Home() {
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
                /* --- 自定义鼠标光标开始 --- */
        
        /* 1. 全局默认鼠标：复古黑色箭头 */
        body, html {
            cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L11.5 22L14.5 13L22 9L2 2Z" fill="black" stroke="white" stroke-width="2"/></svg>') 2 2, auto;
        }

        /* 2. 鼠标悬停在链接、按钮上时：变成红色十字准星 */
        a, button, .cursor-pointer {
            cursor: crosshair !important; 
        }

        /* 3. 悬停时，强制把十字准星变成一种"选中目标"的感觉 (可选优化) */
        a:hover, button:hover {
            /* 这里用 CSS 变量引用你的红色 */
            color: #CC0000; 
        }

        /* --- 自定义鼠标光标结束 --- */


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

        /* 修复后的自适应标题 */
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
            <a href="#works" className="hover:underline decoration-[#CC0000] underline-offset-4">Works</a>
            
            {/* 导航栏简历按钮 - 小巧精致 */}
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

            {/* 自适应标题 */}
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
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
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
                    你好，我是 bub。在过去几年里，我独立操盘过多个品牌的出海项目——从零搭建独立站、做跨境流量、管理海外社媒账号，亲身经历过一个产品如何在陌生市场从 0 开始找到自己的用户。
                </p>
                <p className="text-lg leading-relaxed text-justify text-neutral-700">
                    AI 的出现让我看到了一种可能性：那些曾经需要庞大团队才能做到的事，现在一个人就可以跑通。我正在用 AI 工具重新定义我过去熟悉的每一个工作流，并把它们变成可复用的产品。这个网站，就是这个过程的记录。
                </p>
                
                {/* 社交链接与大号简历下载按钮 */}
                <div className="mt-8 pt-8 border-t border-dashed border-black w-full flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        <a href="#" className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2">
                            <Github size={14} /> Github
                        </a>
                        <a href="#" className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2">
                            <Twitter size={14} /> Twitter
                        </a>
                        <a href="#" className="flex-1 font-sans-ui text-sm font-bold uppercase hover:bg-black hover:text-white py-2 border border-black transition-colors text-center flex items-center justify-center gap-2">
                            <Mail size={14} /> Email
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
                    正在构建：AI 驱动的跨境品牌增长工具集
                    <span className="mx-8 text-[#CC0000]">●</span>
                    海外社媒账号管理经验：TikTok / Instagram / Pinterest
                    <span className="mx-8 text-[#CC0000]">●</span>
                    独立站建站 · 跨境流量 · 品牌出海全链路操盘
                    <span className="mx-8 text-[#CC0000]">●</span>
                    状态：寻找 AI × 出海 的交叉地带
                    <span className="mx-8 text-[#CC0000]">●</span>
                    正在构建：AI 驱动的跨境品牌增长工具集
                    <span className="mx-8 text-[#CC0000]">●</span>
                    海外社媒账号管理经验：TikTok / Instagram / Pinterest
                    <span className="mx-8 text-[#CC0000]">●</span>
                    独立站建站 · 跨境流量 · 品牌出海全链路操盘
                    <span className="mx-8 text-[#CC0000]">●</span>
                    状态：寻找 AI × 出海 的交叉地带
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
                        Sector: Growth & Operations / 增长运营
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
                                <td className="p-2 border-r border-black font-bold">META ADS</td>
                                <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 87.3</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">SEO/SEM</td>
                                <td className="p-2 border-r border-black text-neutral-500">++++----</td>
                                <td className="p-2 text-right text-neutral-400">▼ 78.5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-b md:border-b-0 md:border-r border-black">
                    <div className="p-2 border-b border-black bg-neutral-100 font-mono-data text-[10px] font-bold uppercase tracking-widest text-center">
                        Sector: AI Tooling / AI工具应用
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
                                <td className="p-2 border-r border-black font-bold">WORKFLOW AUTO</td>
                                <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 85.0</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">VIBE CODING</td>
                                <td className="p-2 border-r border-black text-neutral-500">++++----</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 80.2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="font-headline font-bold text-lg mb-2 underline decoration-1 decoration-black">Analyst Note / 专家评级</h4>
                        <p className="font-body text-xs text-justify leading-tight text-neutral-600">
                            该候选人具备稀缺的<span className="text-black font-bold">「出海业务经验 × AI落地应用」</span>复合背景。其对真实商业增长场景的理解，使其在 AI 工具的选择与应用上具备远超纯技术背景候选人的判断力。建议在 AI × 跨境 / AI × 增长 相关岗位上给予重点关注。
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
            <div className="p-4 border-b border-black bg-neutral-100 flex justify-between items-center">
                <h2 className="font-headline text-3xl font-bold">AI Projects</h2>
                <span className="font-mono-data text-xs">(2023 — 2026)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <Link href="/projects/fitness-agent">
                    <article className="group border-b md:border-r border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                        <div className="w-full h-48 border border-black mb-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-[#111111] transition-opacity duration-500 group-hover:opacity-0">
        <span className="absolute left-5 bottom-2 font-headline text-[6rem] font-black leading-none text-white/[0.06] select-none" style={{fontFamily:"'Playfair Display',serif"}}>IP</span>
        <div className="absolute right-5 top-5 w-14 h-14 border border-white/20 rotate-45" />
        <div className="absolute right-8 top-8 w-6 h-6 bg-[#CC0000]/90" />
        <div className="absolute left-5 top-5 font-mono-data text-[9px] text-white/25 tracking-widest uppercase">Iron Press · 01</div>
        <div className="absolute bottom-5 right-5 font-mono-data text-[9px] text-[#CC0000] tracking-widest">AGENT</div>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
            {[80,55,95,40,70].map((w,i) => (
                <div key={i} style={{width:w}} className="h-px bg-white/[0.12]" />
            ))}
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
                            个人健身管理 AI Agent。这是我学习 AI 开发的第一个完整项目，从需求定义到 Prompt 设计到界面搭建，全程独立完成。技术栈：Claude API + Next.js。
                        </p>
                        <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">Launch App &rarr;</span>
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
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">出海实战案例</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">BRAND BUILDING</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">从零到一操盘跨境独立站出海项目。负责 Shopify 建站、Facebook/TikTok 广告投放策略、海外内容账号冷启动，完整经历跨境品牌从0到稳定盈利的全链路。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
                </Link>

                 <Link href="/projects/contentflow">
                 <article className="group border-b md:border-r border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                    <div className="w-full h-48 border border-black mb-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-[#111111] transition-opacity duration-500 group-hover:opacity-0">
        <span className="absolute right-3 bottom-0 font-headline text-[6rem] font-black leading-none text-white/[0.06] select-none" style={{fontFamily:"'Playfair Display',serif"}}>CF</span>
        <div className="absolute left-5 top-5 font-mono-data text-[9px] text-white/25 tracking-widest uppercase">ContentFlow · 03</div>
        <div className="absolute bottom-5 right-5 font-mono-data text-[9px] text-[#CC0000] tracking-widest">AUTOMATION</div>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {[55,100,35,75,55,88].map((w,i) => (
                <div key={i} style={{width:w}} className={`h-[3px] ${i===1 ? "bg-[#CC0000]" : "bg-white/15"}`} />
            ))}
        </div>
        <div className="absolute right-7 top-1/2 -translate-y-1/2 w-px h-14 bg-white/10" />
        <div className="absolute right-5 top-5 font-mono-data text-[9px] text-white/15">■ ■ □</div>
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
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">InkFlow</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">AGENT</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">AI 写作助手，模仿 20 世纪新闻通讯社的口吻进行创作，强调客观与力度。为出海品牌提供符合海外语境的内容生产能力。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
                </Link>
            </div>
        </section>

{/* Gallery Section */}
<section id="gallery" className="border-b border-black bg-white">
    <div className="p-4 border-b border-black bg-neutral-50 flex justify-between items-center">
        <h2 className="font-headline text-3xl font-bold uppercase tracking-tight">Visual Archives / 影像存档</h2>
        <span className="font-mono-data text-[10px] text-neutral-400 italic">TYPE: 35MM SILVER GELATIN PRINT</span>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 border-black">
        <div className="col-span-2 row-span-2 border-r border-b border-black group overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 font-mono-data text-[10px] bg-black text-white px-2 py-1">PLATE NO. 01</div>
            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]"></div>
            <Link href="/projects/darkroom" className="absolute inset-0 z-20">
                <div className="absolute bottom-4 right-4 font-mono-data text-[10px] bg-black text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Open Darkroom →
                </div>
            </Link>
        </div>

        <div className="col-span-1 border-r border-b border-black group overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" 
                 className="w-full h-72 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-white/90 border-t border-black translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="font-mono-data text-[9px] uppercase">Composition Study</p>
            </div>
        </div>

        <div className="col-span-1 border-b border-black group overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=800" 
                 className="w-full h-72 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        <div className="col-span-2 border-b border-black group overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000" 
                 className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(0deg,transparent_1px,#000_1px)] [background-size:100%_3px]"></div>
        </div>

        <div className="col-span-1 border-r border-black p-4 flex flex-col justify-center bg-black text-white">
            <p className="font-headline text-xl leading-tight italic">"The camera is an instrument that teaches people how to see without a camera."</p>
        </div>

        <div className="col-span-1 border-black group overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1493397212122-2b85ddd82fbe?q=80&w=800" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
    </div>
</section>

        {/* Works Section */}
        <section id="works" className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-black p-8 bg-[#111111] text-[#F9F9F7]">
                <h2 className="font-headline text-4xl font-bold mb-4">Works &<br/>Thoughts</h2>
                <p className="font-body text-sm text-neutral-400 mb-8">
                    这里存档了我的文章、随笔以及一些未完成的实验性代码。
                </p>
                <div className="w-8 h-1 bg-[#CC0000] mb-8"></div>
                <div className="font-mono-data text-xs uppercase tracking-widest opacity-50">
                    Last Update: <br/>Feb 02, 2026
                </div>
            </div>

            <div className="md:col-span-9 bg-white">
                <a href="#" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">ESSAY</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            出海运营 × AI：我是如何用 Claude 把内容产能提升 5 倍的
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-02-10</span>
                </a>

                <a href="#" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">CASE STUDY</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            一个独立站的增长复盘：从月销 0 到稳定盈利的关键节点
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-01-18</span>
                </a>

                <a href="#" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">TOOL</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            我的 AI 工作流全公开：Prompt 模板 + 工具链整理
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2025-12-15</span>
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
                    <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                    </a>
                </div>
                <p className="font-mono-data text-[10px] text-neutral-400">© 2026 ALL RIGHTS RESERVED.</p>
            </div>
        </footer>

      </div>
    </div>
  );
}