"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// ── Typewriter ───────────────────────────────────────────────
function useTypewriter(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;
    t = setTimeout(() => {
      let i = 0;
      iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── Redact animation ─────────────────────────────────────────
function RedactReveal({ from, to, delay = 0 }: { from: string; to: string; delay?: number }) {
  const [phase, setPhase] = useState<"hidden" | "redacted" | "revealed">("hidden");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("redacted"), delay);
    const t2 = setTimeout(() => setPhase("revealed"), delay + 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{
        position: "absolute",
        inset: 0,
        background: "#B91C1C",
        transformOrigin: "left",
        transform: phase === "revealed" ? "scaleX(0)" : "scaleX(1)",
        transition: phase === "revealed" ? "transform 0.6s cubic-bezier(0.77,0,0.18,1) 0s" : "none",
        zIndex: 2,
      }} />
      <span style={{ opacity: phase === "hidden" ? 0 : 1, transition: "opacity 0.3s" }}>
        {phase === "redacted" ? from : to}
      </span>
    </span>
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
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── File label ───────────────────────────────────────────────
function FileLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "rgba(200,190,160,0.4)",
      border: "1px solid rgba(200,190,160,0.15)",
      padding: "2px 8px",
    }}>
      {children}
    </span>
  );
}

// ── Technique card ───────────────────────────────────────────
function TechniqueCard({ num, title, tag, children }: {
  num: string; title: string; tag: string; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(185,28,28,0.6)" : "rgba(200,190,160,0.15)"}`,
        borderLeft: `3px solid ${hovered ? "#B91C1C" : "rgba(200,190,160,0.3)"}`,
        padding: "28px 32px",
        position: "relative",
        background: hovered ? "rgba(185,28,28,0.04)" : "transparent",
        transition: "all 0.25s ease",
        marginBottom: 2,
      }}
    >
      {/* Corner ref number */}
      <div style={{
        position: "absolute",
        top: 12,
        right: 16,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.6rem",
        color: "rgba(200,190,160,0.25)",
        letterSpacing: "0.2em",
      }}>
        REF-{num}
      </div>

      {/* Checkbox */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 14, height: 14,
          border: "1px solid rgba(200,190,160,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, background: "#B91C1C", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }} />
        </div>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(185,28,28,0.7)",
        }}>
          {tag}
        </span>
      </div>

      <div style={{
        fontFamily: "'Special Elite', cursive",
        fontSize: "1.15rem",
        color: "#C8C0A8",
        marginBottom: 14,
        letterSpacing: "0.02em",
      }}>
        {title}
      </div>

      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.82rem",
        lineHeight: 1.85,
        color: "rgba(200,190,160,0.55)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Code block ───────────────────────────────────────────────
function DocBlock({ label, children }: { label: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = typeof children === "string" ? children : "";
  return (
    <div style={{
      margin: "2rem 0",
      position: "relative",
      borderLeft: "3px solid rgba(185,28,28,0.4)",
    }}>
      {/* Punched holes */}
      <div style={{ position: "absolute", left: -24, top: 0, bottom: 0, width: 20, display: "flex", flexDirection: "column", justifyContent: "space-around", paddingLeft: 4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid rgba(200,190,160,0.2)", background: "rgba(28,36,25,0.8)" }} />
        ))}
      </div>

      <div style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(200,190,160,0.1)",
        padding: "20px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <FileLabel>{label}</FileLabel>
          <button
            onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              background: "none",
              border: "1px solid rgba(200,190,160,0.2)",
              color: copied ? "#B91C1C" : "rgba(200,190,160,0.3)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "3px 10px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.8rem",
          lineHeight: 1.9,
          color: "rgba(200,190,160,0.65)",
          whiteSpace: "pre-wrap",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function PromptSkillPage() {
  const [ready, setReady] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  const subtitleText = "以及如何真正让它为你工作";
  const { displayed: subDisplayed, done: subDone } = useTypewriter(subtitleText, 45, 1200);

  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (subDone) setTimeout(() => setBodyVisible(true), 400); }, [subDone]);

  return (
    <div style={{ minHeight: "100vh", background: "#1C2419", color: "#C8C0A8" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Share+Tech+Mono&family=IM+Fell+English:ital@0;1&display=swap');

        * { box-sizing: border-box; }

        /* Noise */
        body::before {
          content: '';
          position: fixed; inset: 0;
          pointer-events: none; z-index: 100;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Vignette */
        body::after {
          content: '';
          position: fixed; inset: 0;
          pointer-events: none; z-index: 99;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%);
        }

        /* Cursor */
        * { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="%23C8C0A8" stroke-width="1"/><line x1="0" y1="10" x2="20" y2="10" stroke="%23C8C0A8" stroke-width="1"/></svg>') 10 10, crosshair !important; }
        a, button { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="%23B91C1C" stroke-width="1.5"/><line x1="0" y1="10" x2="20" y2="10" stroke="%23B91C1C" stroke-width="1.5"/></svg>') 10 10, crosshair !important; }

        .cursor-blink {
          display: inline-block; width: 2px; height: 0.9em;
          background: #C8C0A8; margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.9s step-end infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .page-fade { opacity:0; animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { to { opacity:1; } }

        /* Highlight */
        .hl { background: rgba(185,28,28,0.2); padding: 0 3px; color: #EF8080; }

        /* Section divider */
        .section-div {
          border: none;
          border-top: 1px solid rgba(200,190,160,0.1);
          margin: 4rem 0;
          position: relative;
        }
        .section-div::after {
          content: attr(data-label);
          position: absolute; top: -8px; left: 0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(185,28,28,0.5);
          background: #1C2419;
          padding-right: 16px;
        }

        .body-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.95;
          color: rgba(200,190,160,0.6);
          margin-bottom: 1.75rem;
        }

        .body-text strong {
          color: #C8C0A8;
          font-weight: normal;
          text-decoration: underline;
          text-decoration-color: rgba(185,28,28,0.5);
          text-underline-offset: 3px;
        }

        /* Skill anatomy table */
        .skill-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          margin: 2rem 0;
        }
        .skill-table td {
          padding: 14px 20px;
          border: 1px solid rgba(200,190,160,0.08);
          vertical-align: top;
          line-height: 1.7;
        }
        .skill-table td:first-child {
          color: rgba(185,28,28,0.7);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 0.65rem;
          white-space: nowrap;
          border-left: 2px solid rgba(185,28,28,0.3);
          width: 160px;
        }
        .skill-table td:last-child {
          color: rgba(200,190,160,0.55);
        }
        .skill-table tr:hover td {
          background: rgba(185,28,28,0.03);
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className={ready ? "page-fade" : "opacity-0"} style={{
        borderBottom: "1px solid rgba(200,190,160,0.08)",
        padding: "14px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(28,36,25,0.95)",
        backdropFilter: "blur(8px)",
      }}>
        <Link href="/" style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.1rem", color: "#C8C0A8", textDecoration: "none", letterSpacing: "0.1em" }}>
          BN.
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <FileLabel>Vol. II · Methodology · 2026</FileLabel>
          <Link href="/#works"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,190,160,0.3)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "#B91C1C")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(200,190,160,0.3)")}
          >
            ← Archive
          </Link>
        </div>
      </nav>

      {/* ── Classified banner ── */}
      <div className={ready ? "page-fade" : "opacity-0"} style={{
        background: "#B91C1C",
        padding: "8px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        animationDelay: "0.1s",
      }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
          ██ CLASSIFIED — INTERNAL USE ONLY
        </span>
        <RedactReveal from="CLASSIFIED" to="DECLASSIFIED" delay={600} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.6)" }}>
          DOC-2026-02-18
        </span>
      </div>

      {/* ── Header ── */}
      <header style={{ maxWidth: 860, margin: "0 auto", padding: "72px 40px 56px", position: "relative" }}>

        {/* File metadata */}
        <div className={ready ? "page-fade" : "opacity-0"} style={{ display: "flex", gap: 24, marginBottom: 40, flexWrap: "wrap", animationDelay: "0.2s" }}>
          <FileLabel>Subject: AI Collaboration</FileLabel>
          <FileLabel>Classification: Declassified</FileLabel>
          <FileLabel>Author: bubNosmoking</FileLabel>
          <FileLabel>Pages: 01 of 01</FileLabel>
        </div>

        {/* Title */}
        <div className={ready ? "page-fade" : "opacity-0"} style={{ animationDelay: "0.3s" }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(185,28,28,0.6)",
            marginBottom: 20,
          }}>
            — Operation Brief —
          </div>
          <h1 style={{
            fontFamily: "'Special Elite', cursive",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            lineHeight: 1.1,
            color: "#C8C0A8",
            marginBottom: 24,
            letterSpacing: "0.02em",
          }}>
            你没在用 AI，<br />
            你在让 AI <span style={{ color: "#B91C1C" }}>哄你</span>
          </h1>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.85rem",
            color: "rgba(200,190,160,0.4)",
            letterSpacing: "0.05em",
            minHeight: "1.5em",
          }}>
            {subDisplayed}
            {!subDone && <span className="cursor-blink" />}
          </div>
        </div>

        {/* Divider line */}
        <div style={{
          marginTop: 48,
          borderTop: "1px solid rgba(200,190,160,0.12)",
          borderBottom: "1px solid rgba(200,190,160,0.06)",
          padding: "10px 0",
          display: "flex", justifyContent: "space-between",
          opacity: bodyVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(200,190,160,0.25)", textTransform: "uppercase" }}>
            Read Time · 6 min
          </span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(200,190,160,0.25)", textTransform: "uppercase" }}>
            Methodology · Prompt Engineering · AI Workflow
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "0 40px 100px",
        opacity: bodyVisible ? 1 : 0,
        transition: "opacity 0.6s ease 0.2s",
      }}>

        {/* ── Section 0: Opening ── */}
        <RevealSection>
          <p className="body-text">
            我是在健身这件事上第一次意识到这个问题的。
          </p>
          <p className="body-text">
            我把自己的身体数据、训练记录、饮食情况全部给 AI，让它帮我分析。它给我的反馈是——你做得很好，继续保持，这个方向是对的。
          </p>
          <p className="body-text">
            听起来不错。但我知道自己的状态，它说的<span className="hl">不是真话</span>。
          </p>
        </RevealSection>

        <RevealSection delay={100}>
          <DocBlock label="ORIGINAL PROMPT · INEFFECTIVE">
{`帮我分析一下我的健身数据，给我一些建议。`}
          </DocBlock>
        </RevealSection>

        <RevealSection delay={150}>
          <p className="body-text">
            后来我在对话开头加了这样一段话：
          </p>
        </RevealSection>

        <RevealSection delay={200}>
          <DocBlock label="REVISED PROMPT · EFFECTIVE">
{`你是一名有十年经验的私人教练，专注于运动表现提升。
你不给鼓励，不说废话，只给我基于数据的判断。
如果我的方案有问题，直接指出，不需要照顾我的感受。`}
          </DocBlock>
        </RevealSection>

        <RevealSection delay={250}>
          <p className="body-text">
            同样的数据，它的回答变了：你的腿部训练严重不足，和上肢比例失衡。饮食热量缺口太大，会影响肌肉合成。这个训练频率对你目前的恢复能力来说太高了。
          </p>
          <p className="body-text">
            这才是我需要的。
          </p>
        </RevealSection>

        {/* ── Section 1 ── */}
        <RevealSection delay={300}>
          <hr className="section-div" data-label="Section 01 · Root Cause" />
          <p className="body-text">
            AI 不是在骗你，它只是在做它被训练成的样子。它被训练成一个有帮助的、无害的、让人愉快的对话者。在没有额外指令的情况下，它会倾向于给你<strong>正向反馈</strong>，避免让你不舒服。
          </p>
          <p className="body-text">
            这不是缺陷，这是设计。但如果你想要的是真实判断而不是心理安慰，你需要主动打破这个默认值。
          </p>
        </RevealSection>

        {/* ── Section 2: Role ── */}
        <RevealSection delay={350}>
          <hr className="section-div" data-label="Section 02 · Layer One — Role Definition" />
          <p className="body-text">
            有效的角色设定由两部分构成，缺一不可。<strong>身份</strong>告诉它站在哪个视角。<strong>行为限制</strong>告诉它在这个视角里怎么说话。
          </p>
          <p className="body-text">
            只有头衔不够——"你是一名私人教练"，它还是会用教练的身份鼓励你。加上"不允许给我鼓励，只给我事实"，它才真正变成你需要的那个人。
          </p>
        </RevealSection>

        <RevealSection delay={400}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, margin: "2rem 0" }}>
            {[
              { role: "投资人", limit: "你的工作是找漏洞，不是找亮点" },
              { role: "苛刻编辑", limit: "只标出问题，不说'写得很好'" },
              { role: "战略顾问", limit: "站在竞争对手视角，找我方弱点" },
              { role: "法律顾问", limit: "只说风险，不给安慰" },
            ].map((item, i) => (
              <div key={i} style={{
                border: "1px solid rgba(200,190,160,0.08)",
                padding: "16px 20px",
                background: "rgba(0,0,0,0.2)",
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(185,28,28,0.6)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                  身份
                </div>
                <div style={{ fontFamily: "'Special Elite', cursive", fontSize: "1rem", color: "#C8C0A8", marginBottom: 12 }}>
                  {item.role}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(200,190,160,0.35)", letterSpacing: "0.05em", lineHeight: 1.6, borderTop: "1px solid rgba(200,190,160,0.08)", paddingTop: 10 }}>
                  + {item.limit}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Section 3: Prompt ── */}
        <RevealSection delay={450}>
          <hr className="section-div" data-label="Section 03 · Layer Two — Prompt Engineering" />
          <p className="body-text">
            角色设定解决了"它是谁"的问题。但还有一个问题没解决——<strong>它怎么知道你要什么</strong>。大多数人描述了问题，却没有描述答案长什么样。
          </p>
        </RevealSection>

        <RevealSection delay={500}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, margin: "2rem 0" }}>
            <TechniqueCard num="001" title="Output Contract — 先定义「完成」是什么样子" tag="Technique · High Impact">
              在 Prompt 的最后说清楚：格式是什么，长度是多少，必须包含什么。这不是在限制它，这是在告诉它终点在哪里。没有终点的指令，它只能猜。
            </TechniqueCard>
            <TechniqueCard num="002" title="Constraints — 告诉它不能做什么" tag="Technique · Critical">
              比告诉它能做什么更有效。"不要给我模糊的建议"、"不要列超过五条"、"不要用任何专业术语"——负向约束直接切掉你不想要的输出空间。
            </TechniqueCard>
            <TechniqueCard num="003" title="Few-shot — 给它看一个例子" tag="Technique · High Efficiency">
              你想要的输出风格，与其描述，不如直接给它看一个样本。哪怕只有一个例子，它对「你要什么」的理解会准确一个数量级。
            </TechniqueCard>
            <TechniqueCard num="004" title="Chain of Thought — 让它先想再说" tag="Technique · Quality Boost">
              加一句「先列出你的分析过程，再给出结论」。这句话会显著提升输出质量——它在生成结论之前，先被迫做了一次推理。
            </TechniqueCard>
          </div>
        </RevealSection>

        {/* ── Section 4: Skill ── */}
        <RevealSection delay={550}>
          <hr className="section-div" data-label="Section 04 · Layer Three — Skill Architecture" />
          <p className="body-text">
            每次从零开始写角色设定和 Prompt，是一种浪费。当你发现某个角色 + 规则的组合效果很好，把它固化下来。这就是一个 Skill。
          </p>
          <p className="body-text">
            下次遇到同类任务，不需要重新想，直接调用。这也是我做 ContentFlow 这类工具的底层逻辑——把反复用的 Prompt 结构封装成工作流，一个人可以同时管理五个独立站的内容矩阵。
          </p>
        </RevealSection>

        <RevealSection delay={600}>
          <div style={{ margin: "2rem 0" }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(185,28,28,0.5)", marginBottom: 2 }}>
              Skill Anatomy · Standard Template
            </div>
            <table className="skill-table">
              <tbody>
                <tr>
                  <td>Role Definition</td>
                  <td>它是谁，有什么专业背景，代表什么立场</td>
                </tr>
                <tr>
                  <td>Behavior Rules</td>
                  <td>它怎么说话，什么不能做，什么必须做</td>
                </tr>
                <tr>
                  <td>Output Format</td>
                  <td>结果长什么样，用什么结构，多长</td>
                </tr>
                <tr>
                  <td>Quality Standard</td>
                  <td>什么算完成，什么算失败，边界在哪里</td>
                </tr>
                <tr>
                  <td>Few-shot Examples</td>
                  <td>1-3 个你想要的输出样本，比描述更精确</td>
                </tr>
              </tbody>
            </table>
          </div>
        </RevealSection>

        <RevealSection delay={650}>
          <DocBlock label="SKILL EXAMPLE · Content Writer">
{`[Role]
你是一名专注于 B2B SaaS 领域的技术内容撰写人，
有五年为开发者写作的经验。

[Behavior Rules]
- 不使用行话和空洞的形容词
- 每个论点必须有具体例子支撑
- 不超过800字
- 禁止以"在当今时代"或"随着AI的发展"开头

[Output Format]
标题 → 一句话摘要 → 3个核心段落 → 行动建议

[Quality Standard]
完成 = 开发者读完能立刻做一件具体的事`}
          </DocBlock>
        </RevealSection>

        {/* ── Conclusion ── */}
        <RevealSection delay={700}>
          <hr className="section-div" data-label="Conclusion · Final Assessment" />

          {/* Big quote */}
          <div style={{
            margin: "2rem 0 3rem",
            padding: "3rem",
            border: "1px solid rgba(185,28,28,0.2)",
            borderLeft: "4px solid #B91C1C",
            background: "rgba(185,28,28,0.04)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: -1, left: -1, right: -1,
              height: 1,
              background: "linear-gradient(90deg, #B91C1C, transparent)",
            }} />
            <div style={{
              fontFamily: "'Special Elite', cursive",
              fontSize: "clamp(1.3rem, 3vw, 2rem)",
              lineHeight: 1.4,
              color: "#C8C0A8",
              marginBottom: 20,
            }}>
              LLM 是 CPU，你的对话窗口是内存，<br />
              <span style={{ color: "#B91C1C" }}>你的工作是操作系统。</span>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "rgba(200,190,160,0.4)", lineHeight: 1.7 }}>
              把正确的数据和指令加载进去，它才能真正运转。
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={750}>
          <p className="body-text">
            大多数人把 AI 当搜索引擎用，问一个问题，等一个答案。但它实际上更像一个能力极强、但完全不知道你真正需要什么的协作者。它不会主动追问，不会主动纠正，不会主动说"你的问题本身就问错了"——除非你告诉它可以这样做。
          </p>
          <p className="body-text">
            你和 AI 协作的质量，<strong>完全取决于你给它定义的质量</strong>。
          </p>
        </RevealSection>

        {/* End mark */}
        <RevealSection delay={800}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "3rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(200,190,160,0.1)" }} />
            <FileLabel>End of Document · DOC-2026-02-18</FileLabel>
            <div style={{ flex: 1, height: 1, background: "rgba(200,190,160,0.1)" }} />
          </div>
        </RevealSection>

      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(200,190,160,0.08)",
        padding: "40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
        background: "rgba(0,0,0,0.3)",
        opacity: bodyVisible ? 1 : 0,
        transition: "opacity 0.6s ease 0.5s",
      }}>
        <div>
          <div style={{ fontFamily: "'Special Elite', cursive", fontSize: "1rem", color: "#C8C0A8", marginBottom: 6 }}>BN. ARCHIVE</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,190,160,0.2)" }}>
            bubNosmoking · Works & Thoughts · Vol. II
          </div>
        </div>
        <Link href="/#works"
          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,190,160,0.3)", textDecoration: "none" }}
          onMouseOver={e => (e.currentTarget.style.color = "#B91C1C")}
          onMouseOut={e => (e.currentTarget.style.color = "rgba(200,190,160,0.3)")}
        >
          ← All Works
        </Link>
      </footer>

    </div>
  );
}