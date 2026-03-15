"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// ── Grid expand animation ────────────────────────────────────
function BlueprintGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const total = 80;
    const iv = setInterval(() => {
      frame++;
      setProgress(Math.min(frame / total, 1));
      if (frame >= total) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    const revealR = maxR * progress;

    // Small grid
    ctx.strokeStyle = "rgba(100,160,255,0.06)";
    ctx.lineWidth = 0.5;
    const sm = 40;
    for (let x = 0; x < canvas.width; x += sm) {
      const dx = x - cx;
      for (let y = 0; y < canvas.height; y += sm) {
        const dy = y - cy;
        if (Math.sqrt(dx * dx + dy * dy) > revealR) continue;
      }
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += sm) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Large grid
    ctx.strokeStyle = "rgba(100,160,255,0.1)";
    ctx.lineWidth = 0.8;
    const lg = 200;
    for (let x = 0; x < canvas.width; x += lg) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += lg) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── Reveal on scroll ─────────────────────────────────────────
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Dimension label ──────────────────────────────────────────
function DimLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "rgba(100,180,255,0.4)",
      border: "1px solid rgba(100,180,255,0.15)",
      padding: "2px 8px",
    }}>
      {children}
    </span>
  );
}

// ── Annotation arrow ─────────────────────────────────────────
function Annotation({ num, text, side = "right" }: { num: string; text: string; side?: "left" | "right" }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      flexDirection: side === "left" ? "row-reverse" : "row",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0,
        flexDirection: side === "left" ? "row-reverse" : "row",
      }}>
        <div style={{
          width: 20, height: 20,
          border: "1px solid rgba(100,180,255,0.4)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.6rem",
          color: "rgba(100,180,255,0.6)",
          flexShrink: 0,
        }}>
          {num}
        </div>
        <div style={{ width: 24, height: 1, background: "rgba(100,180,255,0.3)" }} />
      </div>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.7rem",
        color: "rgba(100,180,255,0.5)",
        lineHeight: 1.5,
        letterSpacing: "0.05em",
        textAlign: side === "left" ? "right" : "left",
      }}>
        {text}
      </span>
    </div>
  );
}

// ── Legend item ──────────────────────────────────────────────
function LegendItem({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(100,180,255,0.4)" : "rgba(100,180,255,0.12)"}`,
        borderTop: `2px solid ${hovered ? "rgba(100,180,255,0.8)" : "rgba(100,180,255,0.3)"}`,
        padding: "28px 28px 24px",
        background: hovered ? "rgba(100,180,255,0.04)" : "transparent",
        transition: "all 0.25s ease",
        position: "relative",
      }}
    >
      {/* Number tag */}
      <div style={{
        position: "absolute",
        top: -12, left: 20,
        background: "#0A1628",
        padding: "0 8px",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.2rem",
        color: hovered ? "rgba(100,180,255,0.9)" : "rgba(100,180,255,0.4)",
        letterSpacing: "0.1em",
        transition: "color 0.25s ease",
      }}>
        {num}
      </div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(100,180,255,0.4)",
        marginBottom: 12,
      }}>
        REQUIREMENT
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.5rem",
        letterSpacing: "0.08em",
        color: "#B8D4F0",
        marginBottom: 16,
      }}>
        {title}
      </div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.8rem",
        lineHeight: 1.85,
        color: "rgba(184,212,240,0.5)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Error log block ──────────────────────────────────────────
function ErrorLog({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      margin: "2rem 0",
      border: "1px solid rgba(239,68,68,0.3)",
      borderLeft: "3px solid #EF4444",
      background: "rgba(239,68,68,0.04)",
      position: "relative",
    }}>
      <div style={{
        background: "rgba(239,68,68,0.15)",
        padding: "8px 20px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(239,68,68,0.2)",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "pulse 2s infinite" }} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(239,68,68,0.8)",
        }}>
          ERROR LOG · KNOWN ISSUE
        </span>
      </div>
      <div style={{
        padding: "20px 24px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.82rem",
        lineHeight: 1.85,
        color: "rgba(239,68,68,0.6)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Warning note ─────────────────────────────────────────────
function WarningNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      margin: "2rem 0",
      border: "1px solid rgba(251,191,36,0.2)",
      borderLeft: "3px solid #FBBF24",
      background: "rgba(251,191,36,0.03)",
      padding: "16px 24px",
      display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      <span style={{ color: "#FBBF24", fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>⚠</span>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.8rem",
        lineHeight: 1.8,
        color: "rgba(251,191,36,0.6)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function VibeCodingPage() {
  const [ready, setReady] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    setReady(true);
    setTimeout(() => setBodyVisible(true), 1200);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", color: "#B8D4F0", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        * { box-sizing: border-box; }

        /* Noise */
        body::before {
          content: '';
          position: fixed; inset: 0;
          pointer-events: none; z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Cursor */
        * { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="%2364B4FF" stroke-width="1"/><line x1="0" y1="10" x2="20" y2="10" stroke="%2364B4FF" stroke-width="1"/><circle cx="10" cy="10" r="2" stroke="%2364B4FF" stroke-width="1" fill="none"/></svg>') 10 10, crosshair !important; }
        a, button { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="%23FBBF24" stroke-width="1.5"/><line x1="0" y1="10" x2="20" y2="10" stroke="%23FBBF24" stroke-width="1.5"/><circle cx="10" cy="10" r="2" stroke="%23FBBF24" stroke-width="1" fill="none"/></svg>') 10 10, crosshair !important; }

        .page-fade { opacity: 0; animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { to { opacity: 1; } }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .body-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.95;
          color: rgba(184,212,240,0.55);
          margin-bottom: 1.75rem;
        }
        .body-text strong {
          color: #B8D4F0;
          font-weight: 500;
        }

        .section-div {
          border: none;
          border-top: 1px solid rgba(100,180,255,0.1);
          margin: 4rem 0 3rem;
          position: relative;
        }
        .section-div::before {
          content: '';
          position: absolute;
          top: -1px; left: 0;
          width: 48px; height: 1px;
          background: rgba(100,180,255,0.5);
        }
        .section-div::after {
          content: attr(data-label);
          position: absolute; top: -8px; left: 56px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(100,180,255,0.4);
          background: #0A1628;
          padding-right: 16px;
        }

        /* Vertical dimension line */
        .dim-line {
          position: absolute;
          left: -32px; top: 0; bottom: 0;
          width: 1px;
          background: rgba(100,180,255,0.08);
        }
        .dim-line::before, .dim-line::after {
          content: '';
          position: absolute;
          left: -3px;
          width: 7px; height: 1px;
          background: rgba(100,180,255,0.2);
        }
        .dim-line::before { top: 0; }
        .dim-line::after { bottom: 0; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* Blueprint grid background */}
      <BlueprintGrid />

      {/* ── Nav ── */}
      <nav
        className={ready ? "page-fade" : "opacity-0"}
        style={{
          borderBottom: "1px solid rgba(100,180,255,0.08)",
          padding: "14px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,22,40,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#B8D4F0", textDecoration: "none", letterSpacing: "0.1em" }}>
          BN.
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <DimLabel>Vol. III · Engineering · 2026</DimLabel>
          <Link href="/#works"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(100,180,255,0.3)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "#FBBF24")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(100,180,255,0.3)")}
          >
            ← Archive
          </Link>
        </div>
      </nav>

      {/* ── Title bar ── */}
      <div
        className={ready ? "page-fade" : "opacity-0"}
        style={{
          borderBottom: "1px solid rgba(100,180,255,0.1)",
          padding: "10px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(100,180,255,0.03)",
          animationDelay: "0.1s",
        }}
      >
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <DimLabel>Project: Portfolio Site</DimLabel>
          <DimLabel>Duration: 6 Months</DimLabel>
          <div className="hide-mobile"><DimLabel>Scale: 1:1</DimLabel></div>
        </div>
        <DimLabel>Sheet 03 of 03</DimLabel>
      </div>

      {/* ── Header ── */}
      <header style={{ maxWidth: 900, margin: "0 auto", padding: "72px 40px 56px", position: "relative", zIndex: 10 }}>

        {/* Drawing number */}
        <div
          className={ready ? "page-fade" : "opacity-0"}
          style={{ marginBottom: 32, animationDelay: "0.2s" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 0,
            border: "1px solid rgba(100,180,255,0.2)",
          }}>
            <div style={{ padding: "8px 16px", borderRight: "1px solid rgba(100,180,255,0.2)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(100,180,255,0.4)" }}>
              DWG NO.
            </div>
            <div style={{ padding: "8px 16px", borderRight: "1px solid rgba(100,180,255,0.2)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.15em", color: "rgba(100,180,255,0.7)" }}>
              BN-2026-VC-03
            </div>
            <div style={{ padding: "8px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "rgba(100,180,255,0.3)", letterSpacing: "0.1em" }}>
              REV. A
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={ready ? "page-fade" : "opacity-0"} style={{ animationDelay: "0.3s" }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 0.92,
            letterSpacing: "0.04em",
            color: "#B8D4F0",
            marginBottom: 24,
          }}>
            Vibe Coding<br />
            <span style={{ color: "rgba(100,180,255,0.4)" }}>六个月</span>
          </h1>

          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.85rem",
            color: "rgba(184,212,240,0.4)",
            letterSpacing: "0.05em",
            fontStyle: "italic",
            marginBottom: 40,
          }}>
            它是真实的生产力，但门槛不在你以为的地方
          </div>
        </div>

        {/* Spec strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "rgba(100,180,255,0.08)",
          border: "1px solid rgba(100,180,255,0.1)",
          opacity: bodyVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          {[
            { label: "Author", value: "bubNosmoking" },
            { label: "Stack", value: "Next.js + Claude" },
            { label: "Method", value: "Vibe Coding" },
            { label: "Date", value: "2026.03" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0A1628", padding: "12px 16px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(100,180,255,0.3)", marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: "rgba(184,212,240,0.7)" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

      </header>

      {/* ── Body ── */}
      <main style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 40px 120px",
        position: "relative",
        zIndex: 10,
        opacity: bodyVisible ? 1 : 0,
        transition: "opacity 0.6s ease 0.3s",
      }}>

        {/* Vertical dimension line */}
        <div style={{ position: "relative" }}>
          <div className="dim-line hide-mobile" />

          {/* ── Opening ── */}
          <RevealSection>
            <p className="body-text" style={{ fontSize: "1.05rem", color: "rgba(184,212,240,0.75)" }}>
              六个月前，我不会写代码。
            </p>
            <p className="body-text">
              现在我做了一个完整的 portfolio 网站，里面有图像编辑工具、广告解析工具、内容自动化工作流，还有一个基于 Verlet 物理引擎的 Three.js 交互实验。
            </p>
            <p className="body-text">
              这些东西我<strong>一行代码都没有手写过</strong>。
            </p>
          </RevealSection>

          {/* ── Section 1: The real part ── */}
          <RevealSection delay={100}>
            <hr className="section-div" data-label="Section 01 · Field Report — The Real Part" />
            <p className="body-text">
              用 Vibe Coding 做东西，有一种持续的 wow moment。你描述一个想法，它出现在屏幕上。你说"把这个颜色改成暗红色，加一个 hover 动画"，它就改了。你说"我想要一个物理模拟的纸张可以拖拽"，它给你写出一套 Verlet 积分的布料模拟系统。
            </p>
            <p className="body-text">
              这种感觉不会消失。做了六个月，我现在每天还是会有几次觉得——<strong>这他妈也太神了</strong>。
            </p>
            <p className="body-text">
              但如果你以为 Vibe Coding 就是"说话就能做软件"，你会踩很深的坑。
            </p>
          </RevealSection>

          {/* ── Section 2: Error log ── */}
          <RevealSection delay={150}>
            <hr className="section-div" data-label="Section 02 · Error Log — Known Issues" />
            <p className="body-text">
              最让我抓狂的坑，不是它不会——而是它会，但会顺手多做一些你没让它做的事。
            </p>
          </RevealSection>

          <RevealSection delay={200}>
            <ErrorLog>
              ERROR TYPE: Unintended Side Effects<br />
              DESCRIPTION: 你让它修一个按钮的样式，它顺手重构了旁边的布局逻辑。<br />
              你发现页面某个地方坏掉了，但你不知道它动了什么。<br />
              你没有能力直接看代码找问题，只能再让它修，<br />
              它修的时候又动了别的地方。<br />
              STATUS: Recurring · Loop Risk
            </ErrorLog>
          </RevealSection>

          <RevealSection delay={250}>
            <p className="body-text">
              这是 Vibe Coding 最核心的矛盾：<strong>你在用一个你不完全理解的工具，构建一个你不完全控制的东西。</strong>
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <WarningNote>
              WORKAROUND: 给更精确的指令。"只改这一个地方，不要动其他任何东西，改完告诉我你动了哪些文件。" 这句话能救你很多次。
            </WarningNote>
          </RevealSection>

          {/* ── Section 3: Requirements ── */}
          <RevealSection delay={350}>
            <hr className="section-div" data-label="Section 03 · Structural Requirements — What Actually Matters" />
            <p className="body-text">
              大多数人觉得 Vibe Coding 的门槛是技术。这有帮助，但不是决定性的。真正决定你能不能用好它的，是三件事。
            </p>
          </RevealSection>

          <RevealSection delay={400}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, margin: "2rem 0" }}>
              <LegendItem num="R-01" title="学习能力">
                不是学编程，而是遇到问题能快速理解发生了什么。报错出现了，你要能判断是哪个方向的问题，然后用对的方式描述给 AI。
              </LegendItem>
              <LegendItem num="R-02" title="审美">
                AI 能生成代码，但它不知道什么是好看的。它会给你一个"可以用"的界面，但"可以用"和"让人印象深刻"之间的距离，完全取决于你的判断力。
              </LegendItem>
              <LegendItem num="R-03" title="语言表达">
                脑子里有一个模糊的画面，要把它变成 AI 能执行的精确指令，本质上是一种思维能力。你越能清楚地描述你要什么，它给你的就越接近。
              </LegendItem>
            </div>
          </RevealSection>

          {/* ── Section 4: Annotations ── */}
          <RevealSection delay={450}>
            <hr className="section-div" data-label="Section 04 · Field Annotations" />
            <div style={{ display: "flex", flexDirection: "column", gap: 20, margin: "2rem 0" }}>
              <Annotation num="A" text="审美是这三个里最难后天习得的。学习能力和语言表达可以刻意练习，但审美需要长时间的积累。" />
              <Annotation num="B" text="语言表达的能力和 Prompt Engineering 是同一件事——把模糊的意图变成精确的指令。" side="right" />
              <Annotation num="C" text="学习能力在这里的具体含义是：能快速建立关于这个工具/框架的心智模型，然后用这个模型预测它的行为。" />
            </div>
          </RevealSection>

          {/* ── Conclusion ── */}
          <RevealSection delay={500}>
            <hr className="section-div" data-label="Section 05 · Conclusion · Final Assessment" />
            <p className="body-text">
              Vibe Coding 是一个放大器。
            </p>
            <p className="body-text">
              如果你有审美，它帮你把审美变成产品。如果你有判断力，它帮你把判断力变成功能。如果你擅长把想法变成语言，它帮你把语言变成代码。
            </p>
          </RevealSection>

          {/* Big quote */}
          <RevealSection delay={550}>
            <div style={{
              margin: "2rem 0 3rem",
              padding: "40px",
              border: "1px solid rgba(100,180,255,0.15)",
              borderTop: "2px solid rgba(100,180,255,0.5)",
              position: "relative",
              background: "rgba(100,180,255,0.02)",
            }}>
              {/* Corner marks */}
              {[
                { top: -1, right: -1, borderTop: "8px solid rgba(100,180,255,0.4)", borderRight: "8px solid rgba(100,180,255,0.4)" },
                { bottom: -1, left: -1, borderBottom: "8px solid rgba(100,180,255,0.4)", borderLeft: "8px solid rgba(100,180,255,0.4)" },
              ].map((style, i) => (
                <div key={i} style={{ position: "absolute", width: 16, height: 16, ...style }} />
              ))}

              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                lineHeight: 1.1,
                color: "#B8D4F0",
                letterSpacing: "0.04em",
                marginBottom: 20,
              }}>
                它放大的是<br />
                <span style={{ color: "rgba(100,180,255,0.5)" }}>你本来就有的东西。</span>
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.8rem",
                color: "rgba(184,212,240,0.4)",
                lineHeight: 1.7,
              }}>
                如果这些东西你本来就没有，它放大的是空白。
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={600}>
            <p className="body-text">
              这也是为什么我不认为 Vibe Coding 会让所有人都成为产品经理或者独立开发者。它降低了执行的门槛，但<strong>没有降低思考的门槛</strong>。
            </p>
            <p className="body-text">
              那个门槛一直都在。只是现在，它藏得更深了。
            </p>
          </RevealSection>

          {/* End stamp */}
          <RevealSection delay={650}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "3rem" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(100,180,255,0.08)" }} />
              <div style={{ display: "flex", gap: 2 }}>
                <DimLabel>End of Document</DimLabel>
                <DimLabel>BN-2026-VC-03</DimLabel>
              </div>
              <div style={{ flex: 1, height: 1, background: "rgba(100,180,255,0.08)" }} />
            </div>
          </RevealSection>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(100,180,255,0.08)",
        padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
        background: "rgba(0,0,0,0.3)",
        position: "relative", zIndex: 10,
        opacity: bodyVisible ? 1 : 0,
        transition: "opacity 0.6s ease 0.5s",
      }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", color: "#B8D4F0", marginBottom: 6 }}>
            BN. ARCHIVE
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(100,180,255,0.2)" }}>
            bubNosmoking · Works & Thoughts · Vol. III
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <DimLabel>Sheet 03 / 03</DimLabel>
          <Link href="/#works"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(100,180,255,0.3)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "#FBBF24")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(100,180,255,0.3)")}
          >
            ← All Works
          </Link>
        </div>
      </footer>

    </div>
  );
}