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

        /* 3. 悬停时，强制把十字准星变成一种“选中目标”的感觉 (可选优化) */
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
                Design Engineer &bull; Creative Developer &bull; Minimalist
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
                    你好，我是 bub, 在这个充斥着过度设计的数字世界里，我追求极致的清晰与结构。我认为代码不仅仅是功能的堆砌，更是一种现代的诗歌。
                </p>
                <p className="text-lg leading-relaxed text-justify text-neutral-700">
                    作为一名开发者与设计爱好者，我致力于创造既有印刷品般的阅读体验，又具备现代 Web 交互流畅性的数字产品。欢迎来到我的个人空间，这里记录了我的思考与创造。
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
                    BUBNOSMOKING 正在探索深度合成 UI 设计系统 
                    <span className="mx-8 text-[#CC0000]">●</span>
                    最新项目 "TypeMaster" 已上线 
                    <span className="mx-8 text-[#CC0000]">●</span>
                    技能点更新: React 19, Tailwind CSS v4, AI Agent 开发 
                    <span className="mx-8 text-[#CC0000]">●</span>
                    状态: 寻找有趣的创意合作伙伴 
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
                        Sector: Development / 核心开发
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
                                <td className="p-2 border-r border-black font-bold">REACT</td>
                                <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 94.2</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">NEXT.JS</td>
                                <td className="p-2 border-r border-black text-neutral-500">++++----</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 88.5</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">PYTHON</td>
                                <td className="p-2 border-r border-black text-neutral-500">+++-----</td>
                                <td className="p-2 text-right text-neutral-400">▼ 72.1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-b md:border-b-0 md:border-r border-black">
                    <div className="p-2 border-b border-black bg-neutral-100 font-mono-data text-[10px] font-bold uppercase tracking-widest text-center">
                        Sector: Visual Design / 视觉设计
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
                                <td className="p-2 border-r border-black font-bold">TYPO</td>
                                <td className="p-2 border-r border-black text-neutral-500">++++++--</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 91.0</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">FIGMA</td>
                                <td className="p-2 border-r border-black text-neutral-500">++++----</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 85.4</td>
                            </tr>
                            <tr className="hover:bg-neutral-50">
                                <td className="p-2 border-r border-black font-bold">LAYOUT</td>
                                <td className="p-2 border-r border-black text-neutral-500">+++++---</td>
                                <td className="p-2 text-right text-[#CC0000]">▲ 89.2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="font-headline font-bold text-lg mb-2 underline decoration-1 decoration-black">Analyst Note / 专家评级</h4>
                        <p className="font-body text-xs text-justify leading-tight text-neutral-600">
                            该候选人在 <span className="text-black font-bold">前端架构 (FE)</span> 领域表现出强劲的看涨趋势。其对 Newsprint 审美风格的控制力处于行业高位，建议在需要极致视觉一致性的项目中给予“买入”评级。
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-black">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="font-mono-data text-[10px] uppercase">Confidence Score</div>
                                <div className="font-headline text-3xl font-black">9.82</div>
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
                    TSLA +2.4% | BTC +1.2% | REACT +5.6% | TYPESCRIPT +3.2% | BUB +9.9% | NO SMOKING +100% | 
                    TSLA +2.4% | BTC +1.2% | REACT +5.6% | TYPESCRIPT +3.2% | BUB +9.9% | NO SMOKING +100%
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
                        <div className="w-full h-48 border border-black bg-neutral-200 mb-6 overflow-hidden relative flex items-center justify-center">
                            <span className="font-mono-data text-neutral-400">PROJECT 01</span>
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">Iron Press</h3>
                            <span className="font-mono-data text-xs border border-black px-1 rounded-none">AGENT</span>
                        </div>
                        <p className="font-body text-neutral-600 line-clamp-3 mb-4">
                             你的私人 AI 健身教练。基于 GPT-4o，提供实时训练计划生成、动作指导与饮食建议。
                        </p>
                        <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">Launch App &rarr;</span>
                    </article>
                </Link>

                <article className="group border-b border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                    <div className="w-full h-48 border border-black bg-neutral-200 mb-6 overflow-hidden relative flex items-center justify-center">
                         <span className="font-mono-data text-neutral-400">PROJECT 02</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">MonoGrid</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">VISION</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">智能图像处理引擎，自动将彩色照片转换为具有报纸网点质感的黑白艺术作品。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>

                 <article className="group border-b md:border-r border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                    <div className="w-full h-48 border border-black bg-neutral-200 mb-6 overflow-hidden relative flex items-center justify-center">
                         <span className="font-mono-data text-neutral-400">PROJECT 03</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">NewsBot</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">NLP</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">自动摘要机器人，能够将数万字的调研报告精炼成一段具有新闻时效感的短消息。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>

                <article className="group border-b border-black p-8 hover-lift cursor-pointer bg-[#F9F9F7]">
                    <div className="w-full h-48 border border-black bg-neutral-200 mb-6 overflow-hidden relative flex items-center justify-center">
                         <span className="font-mono-data text-neutral-400">PROJECT 04</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-headline text-2xl font-bold group-hover:underline decoration-2 decoration-[#CC0000] underline-offset-4">InkFlow</h3>
                        <span className="font-mono-data text-xs border border-black px-1 rounded-none">AGENT</span>
                    </div>
                    <p className="font-body text-neutral-600 line-clamp-3 mb-4">AI 写作助手，模仿 20 世纪新闻通讯社的口吻进行创作，强调客观与力度。</p>
                    <span className="font-sans-ui text-xs font-bold uppercase tracking-widest group-hover:text-[#CC0000]">View Case Study &rarr;</span>
                </article>
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
                            为什么我们需要“反现代”的设计？
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2026-01-15</span>
                </a>

                <a href="#" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">CODE</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            CSS Grid 的 10 个高级技巧
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2025-12-20</span>
                </a>

                <a href="#" className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-black hover:bg-neutral-100 transition-colors">
                    <div className="mb-2 md:mb-0">
                        <span className="font-mono-data text-xs text-[#CC0000] mr-2">LIFE</span>
                        <h4 className="font-headline text-xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                            2025 年度总结：极简生活
                        </h4>
                    </div>
                    <span className="font-mono-data text-xs text-neutral-500">2025-12-01</span>
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
                    Designed & Built with <br/>Newsprint Design System.
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
