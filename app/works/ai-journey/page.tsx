"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// ── Typewriter hook ──────────────────────────────────────────
function useTypewriter(text: string, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Stamp component ──────────────────────────────────────────
function Stamp({ text, rotate = 0, opacity = 0.12 }: { text: string; rotate?: number; opacity?: number }) {
  return (
    <div
      className="inline-block border-4 px-4 py-1 uppercase tracking-[0.3em] text-xs font-black select-none pointer-events-none"
      style={{
        fontFamily: "'Courier Prime', monospace",
        color: "#B91C1C",
        borderColor: "#B91C1C",
        opacity,
        transform: `rotate(${rotate}deg)`,
        filter: "blur(0.3px)",
        mixBlendMode: "multiply",
      }}
    >
      {text}
    </div>
  );
}

// ── Annotation ───────────────────────────────────────────────
function Annotation({ children, side = "right" }: { children: React.ReactNode; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute ${side === "right" ? "-right-48 md:-right-56" : "-left-48 md:-left-56"} top-0 w-40 md:w-48`}
      style={{ fontFamily: "'Caveat', cursive", fontSize: "0.8rem", color: "rgba(30,20,10,0.45)", lineHeight: 1.4 }}
    >
      <div className={`flex items-start gap-1 ${side === "left" ? "flex-row-reverse text-right" : ""}`}>
        <span style={{ color: "#B91C1C", fontSize: "1rem" }}>{side === "right" ? "→" : "←"}</span>
        <span>{children}</span>
      </div>
    </div>
  );
}

// ── Section with reveal ──────────────────────────────────────
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function AIJourneyPage() {
  const [pageReady, setPageReady] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const titleText = "我不是技术人，但我比\n大多数技术人更早\n想清楚了一件事";
  const { displayed: titleDisplayed, done: titleDone } = useTypewriter(titleText, 35, 400);

  useEffect(() => {
    setPageReady(true);
  }, []);

  useEffect(() => {
    if (titleDone) {
      setTimeout(() => setShowBody(true), 300);
    }
  }, [titleDone]);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8", color: "#1A1208" }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Anton&family=Caveat:wght@400;600&family=IM+Fell+English:ital@0;1&display=swap');

        :root {
          --paper: #F5F0E8;
          --ink: #1A1208;
          --red: #B91C1C;
          --ink-faint: rgba(26,18,8,0.35);
          --ink-mid: rgba(26,18,8,0.6);
        }

        * { box-sizing: border-box; }

        /* Noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Scanlines */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(26,18,8,0.012) 2px,
            rgba(26,18,8,0.012) 4px
          );
        }

        /* Custom cursor */
        *, *::before, *::after {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><line x1="10" y1="0" x2="10" y2="20" stroke="%231A1208" stroke-width="1.5"/><line x1="0" y1="10" x2="20" y2="10" stroke="%231A1208" stroke-width="1.5"/></svg>') 10 10, crosshair !important;
        }

        a, button {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><line x1="10" y1="0" x2="10" y2="20" stroke="%23B91C1C" stroke-width="1.5"/><line x1="0" y1="10" x2="20" y2="10" stroke="%23B91C1C" stroke-width="1.5"/></svg>') 10 10, crosshair !important;
        }

        /* Horizontal rule style */
        .zine-hr {
          border: none;
          border-top: 1px solid rgba(26,18,8,0.2);
          margin: 3.5rem 0;
          position: relative;
        }
        .zine-hr::after {
          content: '✦';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--paper);
          padding: 0 12px;
          color: var(--red);
          font-size: 12px;
        }

        /* Pull quote */
        .pull-quote {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2.2rem, 6vw, 4.5rem);
          line-height: 1;
          letter-spacing: -0.01em;
          color: var(--ink);
          position: relative;
        }

        /* Body text */
        .body-text {
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          line-height: 1.95;
          color: var(--ink-mid);
        }

        .body-text strong {
          color: var(--ink);
          font-weight: 700;
        }

        /* Page load fade */
        .page-enter {
          opacity: 0;
          animation: pageEnter 0.6s ease forwards;
        }
        @keyframes pageEnter {
          to { opacity: 1; }
        }

        /* Cursor blink */
        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--ink);
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Issue label */
        .issue-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }

        /* Red underline accent */
        .red-underline {
          text-decoration: underline;
          text-decoration-color: var(--red);
          text-underline-offset: 4px;
          text-decoration-thickness: 2px;
        }

        /* Torn edge top */
        .torn-top {
          position: relative;
        }
        .torn-top::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 0;
          right: 0;
          height: 8px;
          background: var(--paper);
          clip-path: polygon(0% 100%, 2% 0%, 5% 80%, 8% 10%, 11% 90%, 14% 20%, 17% 70%, 20% 0%, 23% 85%, 26% 15%, 29% 75%, 32% 5%, 35% 90%, 38% 20%, 41% 80%, 44% 0%, 47% 95%, 50% 10%, 53% 85%, 56% 25%, 59% 70%, 62% 5%, 65% 90%, 68% 20%, 71% 75%, 74% 0%, 77% 85%, 80% 15%, 83% 80%, 86% 10%, 89% 90%, 92% 20%, 95% 70%, 98% 5%, 100% 100%);
        }

        @media (max-width: 768px) {
          .annotation-hide { display: none; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav
        className={pageReady ? "page-enter" : "opacity-0"}
        style={{
          borderBottom: "1px solid rgba(26,18,8,0.15)",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "rgba(245,240,232,0.92)",
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.25rem", color: "var(--ink)", textDecoration: "none", letterSpacing: "0.05em" }}>
          BN.
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span className="issue-label">Vol. I · Essay · 2026</span>
          <Link
            href="/#works"
            style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--red)")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--ink-faint)")}
          >
            ← Archive
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={{ padding: "80px 40px 60px", maxWidth: 900, margin: "0 auto", position: "relative" }}>

        {/* Issue info strip */}
        <div
          className={`issue-label mb-8 flex items-center gap-6 ${pageReady ? "page-enter" : "opacity-0"}`}
          style={{ animationDelay: "0.1s" }}
        >
          <span>Non-Technical · AI · Career</span>
          <span style={{ color: "var(--red)" }}>■</span>
          <span>bubNosmoking</span>
          <span style={{ color: "var(--red)" }}>■</span>
          <span>2026.02.10</span>
        </div>

        {/* Title — typewriter */}
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2.8rem, 8vw, 6rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            whiteSpace: "pre-line",
            marginBottom: "2.5rem",
          }}
        >
          {titleDisplayed}
          {!titleDone && <span className="cursor-blink" />}
        </h1>

        {/* Subtitle line */}
        <div
          style={{
            opacity: showBody ? 1 : 0,
            transform: showBody ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
            <div style={{ width: 48, height: 3, background: "var(--red)" }} />
            <span style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "1.1rem", color: "var(--ink-mid)" }}>
              一个非技术人的AI使用者告白
            </span>
          </div>

          {/* Stamp decorations */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Stamp text="First-Hand Account" rotate={-2} opacity={0.15} />
            <Stamp text="2022 — 2026" rotate={1} opacity={0.12} />
          </div>
        </div>

      </header>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ borderTop: "3px solid var(--ink)", borderBottom: "1px solid rgba(26,18,8,0.2)", padding: "8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="issue-label">Feature</span>
          <span className="issue-label">Read time · 4 min</span>
        </div>
      </div>

      {/* ── Body ── */}
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "60px 40px 100px",
          opacity: showBody ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
        }}
      >

        {/* Column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, position: "relative" }}>

          {/* ── Section 1 ── */}
          <RevealSection delay={0}>
            <div style={{ position: "relative", marginBottom: "2.5rem" }}>
              <p className="body-text">
                2022 年底，ChatGPT 刚发布，国内还用不了。我搞了个国外手机号注册，在广告公司做创意的间隙开始用它。不是因为看了什么报道，只是好奇。
              </p>
              <div className="annotation-hide" style={{ position: "absolute", right: -220, top: 0, width: 180 }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem", color: "rgba(26,18,8,0.4)", lineHeight: 1.4 }}>
                  → 2022年末，大部分人还不知道ChatGPT是什么
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              这大概是我的一个习惯——出了什么新东西，我都想亲手试试。Midjourney 刚出来我去试，Sora 内测我去试，AI 音乐生成器我去试，vibe coding 出来我也去试。不是为了跟上趋势，就是单纯想知道这东西到底<span className="red-underline">能干什么、不能干什么</span>。ChatGPT 也是这样，它发布的时候我只是想试试，没想到这一试就再也没停下来。
            </p>
          </RevealSection>

          <RevealSection delay={150}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              那时候大多数人还在讨论"AI 会不会取代人类"，我已经在用它帮我想广告 slogan 了。
            </p>
          </RevealSection>

          {/* ── Pull quote 1 ── */}
          <RevealSection delay={200}>
            <div style={{ margin: "3rem 0", padding: "2.5rem 0", borderTop: "1px solid rgba(26,18,8,0.15)", borderBottom: "1px solid rgba(26,18,8,0.15)", position: "relative" }}>
              <div className="pull-quote">
                在内容创作<br />
                这件事上，<br />
                <span style={{ color: "var(--red)" }}>它已经比<br />我好了。</span>
              </div>
              <div className="annotation-hide" style={{ position: "absolute", right: -220, top: "50%", transform: "translateY(-50%)", width: 180 }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem", color: "rgba(185,28,28,0.6)", lineHeight: 1.4 }}>
                  → 这句话需要勇气说出来
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={250}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              之后的两年，我一直在用，一直在观察它变。有一天我意识到一件事，然后我停下来想了很久：<strong>在内容创作这件事上，它已经比我好了。</strong>
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div style={{ position: "relative", marginBottom: "2.5rem" }}>
              <p className="body-text">
                我没有焦虑。我的第一反应是——那我现在在重复做什么？
              </p>
              <p className="body-text" style={{ marginTop: "1.5rem" }}>
                答案是：每次都要重新输入一堆 prompt。同样的逻辑，同样的结构，同样的要求，一遍一遍地打。AI 帮我做了内容，但我还是一个<span className="red-underline">人肉的调度中心</span>。
              </p>
              <div className="annotation-hide" style={{ position: "absolute", right: -220, top: 0, width: 180 }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem", color: "rgba(26,18,8,0.4)", lineHeight: 1.4 }}>
                  → 不焦虑，直接行动——这是正确的反应
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={350}>
            <p className="body-text" style={{ marginBottom: "3rem" }}>
              所以我开始想怎么把这个过程自动化。这是我做第一个 AI 工具的起点——不是因为我懂技术，而是因为我<strong>懒得重复</strong>。
            </p>
          </RevealSection>

          {/* ── HR ── */}
          <RevealSection delay={400}>
            <hr className="zine-hr" />
          </RevealSection>

          {/* ── Section 2 ── */}
          <RevealSection delay={450}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              当然，这个过程里我也踩过坑。最典型的一个：让 AI 写新闻类内容的时候，它会非常自信地编造一些从未发生过的事件。细节逼真，逻辑通顺，就是假的。
            </p>
          </RevealSection>

          <RevealSection delay={500}>
            <p className="body-text" style={{ marginBottom: "3rem" }}>
              这件事让我明白了一个道理，现在我仍然认为它是理解 AI 最重要的一句话：
            </p>
          </RevealSection>

          {/* ── Mega quote ── */}
          <RevealSection delay={550}>
            <div style={{
              margin: "1rem 0 3rem",
              padding: "3rem 2rem",
              background: "var(--ink)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Background texture */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px)",
                pointerEvents: "none",
              }} />
              <div
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  lineHeight: 1.05,
                  color: "var(--paper)",
                  letterSpacing: "-0.01em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                AI 不知道<br />
                <span style={{ color: "#EF4444" }}>自己不知道</span><br />
                什么。
              </div>
              <div style={{ position: "absolute", bottom: 16, right: 20, opacity: 0.15 }}>
                <Stamp text="Key Insight" rotate={-3} opacity={1} />
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={600}>
            <div style={{ position: "relative", marginBottom: "2.5rem" }}>
              <p className="body-text">
                它没有"我不确定"的本能。它只会生成听起来合理的东西。所以你必须自己知道它的边界在哪里——<strong>这件事没有办法外包给它</strong>。
              </p>
              <div className="annotation-hide" style={{ position: "absolute", right: -220, top: 0, width: 180 }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem", color: "rgba(185,28,28,0.6)", lineHeight: 1.4 }}>
                  → 幻觉问题至今仍然存在，只是变小了
                </div>
              </div>
            </div>
          </RevealSection>

          {/* ── HR ── */}
          <RevealSection delay={650}>
            <hr className="zine-hr" />
          </RevealSection>

          {/* ── Section 3 ── */}
          <RevealSection delay={700}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              这是非技术背景进入 AI 领域的人，和技术背景进入的人，最本质的差别：
            </p>
          </RevealSection>

          <RevealSection delay={750}>
            <div style={{
              margin: "0 0 2.5rem",
              padding: "1.5rem 2rem",
              borderLeft: "4px solid var(--red)",
              background: "rgba(185,28,28,0.04)",
            }}>
              <p className="body-text" style={{ margin: 0, color: "var(--ink)" }}>
                技术人更容易相信模型，因为他们理解它是怎么工作的。我不理解，所以我只信我自己测试过的结果。
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={800}>
            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              某种程度上，这反而是一种优势。
            </p>
          </RevealSection>

          <RevealSection delay={850}>
            <div style={{ position: "relative", marginBottom: "4rem" }}>
              <p className="body-text">
                我不是最懂 AI 的人，但我可能是<span className="red-underline">试过最多 AI 工具的人之一</span>。而那些真正留下来的工具，都是在真实的工作场景里被我反复摔打过之后还站着的。
              </p>
              <div className="annotation-hide" style={{ position: "absolute", right: -220, top: 0, width: 180 }}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem", color: "rgba(26,18,8,0.4)", lineHeight: 1.4 }}>
                  → 实践者的优势，不可替代
                </div>
              </div>
            </div>
          </RevealSection>

          {/* ── End mark ── */}
          <RevealSection delay={900}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 32, height: 2, background: "var(--red)" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--ink-faint)", textTransform: "uppercase" }}>End of Article</span>
              <div style={{ width: 32, height: 2, background: "var(--red)" }} />
            </div>
          </RevealSection>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="torn-top"
        style={{
          background: "var(--ink)",
          padding: "48px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
          opacity: showBody ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}
      >
        <div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.5rem", color: "var(--paper)", letterSpacing: "0.05em", marginBottom: 8 }}>
            BN. ZINE
          </div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>
            bubNosmoking · Works & Thoughts · Vol. I
          </div>
        </div>
        <Link
          href="/#works"
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.4)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(245,240,232,0.2)",
            paddingBottom: 2,
          }}
          onMouseOver={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderBottomColor = "#EF4444"; }}
          onMouseOut={e => { e.currentTarget.style.color = "rgba(245,240,232,0.4)"; e.currentTarget.style.borderBottomColor = "rgba(245,240,232,0.2)"; }}
        >
          ← All Works
        </Link>
      </footer>

    </div>
  );
}