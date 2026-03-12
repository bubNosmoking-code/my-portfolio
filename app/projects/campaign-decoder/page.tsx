"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================
type InputMode = "paste" | "url" | "describe";
type Step = 1 | 2 | 3;

interface DissectResult {
  psychology: { analysis: string; score: number; technique: string };
  emotion: { analysis: string; score: number; arc: string };
  narrative: { analysis: string; score: number; framework: string };
  audience: { analysis: string; score: number; signal: string };
  hook: { analysis: string; score: number; type: string };
  vulnerability: { analysis: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" };
  overall_verdict: string;
  lethality_score: number;
  annotations: {
    hook_phrases: string[];
    psychology_phrases: string[];
    emotion_phrases: string[];
    cta_phrases: string[];
  };
}

// ============================================================
// API
// ============================================================
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response");
  return text;
}

// ============================================================
// ANNOTATED TEXT — live phrase highlighting
// ============================================================
function AnnotatedText({
  text, annotations, active,
}: {
  text: string;
  annotations: DissectResult["annotations"] | null;
  active: boolean;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (!active) { setVisibleChars(0); return; }
    let i = 0;
    const iv = setInterval(() => {
      i += 5;
      setVisibleChars(i);
      if (i >= text.length) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [text, active]);

  const visible = text.slice(0, visibleChars);

  if (!annotations) {
    return (
      <div className="font-serif text-sm leading-relaxed text-black/70 whitespace-pre-wrap">
        {visible}
      </div>
    );
  }

  // Build annotated segments
  type Seg = { text: string; type: string };
  const segments: Seg[] = [];
  const allPhrases = [
    ...annotations.hook_phrases.map(p => ({ phrase: p, type: "hook" })),
    ...annotations.psychology_phrases.map(p => ({ phrase: p, type: "psy" })),
    ...annotations.emotion_phrases.map(p => ({ phrase: p, type: "emo" })),
    ...annotations.cta_phrases.map(p => ({ phrase: p, type: "cta" })),
  ].sort((a, b) => text.indexOf(a.phrase) - text.indexOf(b.phrase));

  let cursor = 0;
  for (const { phrase, type } of allPhrases) {
    const idx = visible.indexOf(phrase, cursor);
    if (idx === -1) continue;
    if (idx > cursor) segments.push({ text: visible.slice(cursor, idx), type: "normal" });
    segments.push({ text: phrase, type });
    cursor = idx + phrase.length;
  }
  if (cursor < visible.length) segments.push({ text: visible.slice(cursor), type: "normal" });

  const typeClass: Record<string, string> = {
    hook: "bg-red-50 border-b-2 border-red-500 font-bold text-red-700",
    psy: "border-b-2 border-black font-semibold",
    emo: "border-b border-black/40 italic",
    cta: "bg-red-50/60 border-b border-red-400 font-semibold",
    normal: "",
  };

  return (
    <div className="font-serif text-sm leading-relaxed text-black/75 whitespace-pre-wrap">
      {segments.map((s, i) => (
        <span key={i} className={typeClass[s.type]}>{s.text}</span>
      ))}
      {visibleChars < text.length && (
        <span className="inline-block w-0.5 h-4 bg-black align-middle animate-pulse ml-px" />
      )}
    </div>
  );
}

// ============================================================
// SLOT MACHINE SCORE
// ============================================================
function SlotScore({ score, active }: { score: number; active: boolean }) {
  const [val, setVal] = useState(0);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!active) { setVal(0); return; }
    setRolling(true);
    let frame = 0;
    const total = 45;
    const iv = setInterval(() => {
      frame++;
      if (frame < total * 0.65) {
        setVal(Math.floor(Math.random() * 10) + 1);
      } else {
        const p = (frame - total * 0.65) / (total * 0.35);
        setVal(Math.round(p * score));
      }
      if (frame >= total) {
        setVal(score);
        setRolling(false);
        clearInterval(iv);
      }
    }, 35);
    return () => clearInterval(iv);
  }, [score, active]);

  return (
    <div className="flex items-baseline gap-1">
      <span
        className="font-display font-black leading-none tabular-nums"
        style={{
          fontSize: "3.5rem",
          filter: rolling ? "blur(2px)" : "none",
          transition: rolling ? "none" : "filter 0.3s",
        }}
      >
        {val}
      </span>
      <span className="font-mono text-xs text-black/20 mb-1">/10</span>
    </div>
  );
}

// ============================================================
// TILT CARD — magnetic 3D hover + light
// ============================================================
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(6px)`;
    ref.current.style.background = `radial-gradient(circle at ${50 + x * 80}% ${50 + y * 80}%, rgba(255,255,255,0.95) 0%, #FAFAF8 65%)`;
  }, []);

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.background = "";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.18s ease, background 0.4s ease", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

// ============================================================
// PAGE TEAR
// ============================================================
function PageTear({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: "50%",
          background: "#FAFAF8",
          animation: "tearL 0.55s cubic-bezier(0.77,0,0.18,1) forwards",
        }}
      />
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, right: 0, width: "50%",
          background: "#FAFAF8",
          animation: "tearR 0.55s cubic-bezier(0.77,0,0.18,1) forwards",
        }}
      />
    </div>
  );
}

// ============================================================
// PARTICLE BG
// ============================================================
function ParticleBg() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const pts = useRef<{ x: number; y: number; ox: number; oy: number; vx: number; vy: number }[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pts.current = [];
      for (let i = 0; i < canvas.width; i += 44) {
        for (let j = 0; j < canvas.height; j += 44) {
          pts.current.push({ x: i + 22, y: j + 22, ox: i + 22, oy: j + 22, vx: 0, vy: 0 });
        }
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x, my = mouse.current.y;
      for (const p of pts.current) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 90 - d) / 90;
        p.vx += (p.ox - p.x) * 0.09 - (dx / (d || 1)) * f * 2;
        p.vy += (p.oy - p.y) * 0.09 - (dy / (d || 1)) * f * 2;
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,10,10,${0.05 + f * 0.18})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    init();
    tick();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMouse);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={cvs} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }} />;
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rpos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
    };
    const tick = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.11;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.11;
      if (ring.current) { ring.current.style.left = rpos.current.x + "px"; ring.current.style.top = rpos.current.y + "px"; }
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position: "fixed", width: 6, height: 6, background: "#0A0A0A", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)" }} />
      <div ref={ring} style={{ position: "fixed", width: 30, height: 30, border: "1px solid rgba(10,10,10,0.25)", borderRadius: "50%", pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)", transition: "width 0.2s, height 0.2s" }} />
    </>
  );
}

// ============================================================
// REBUILD TYPEWRITER — matrix decode
// ============================================================
function RebuildText({ text, active }: { text: string; active: boolean }) {
  const [out, setOut] = useState("");
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";

  useEffect(() => {
    if (!active || !text) return;
    setOut("");
    let r = 0;
    const iv = setInterval(() => {
      r += 4;
      let s = "";
      for (let i = 0; i < Math.min(r + 12, text.length); i++) {
        if (i < r) s += text[i];
        else s += (text[i] === " " || text[i] === "\n") ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOut(s);
      if (r >= text.length) clearInterval(iv);
    }, 22);
    return () => clearInterval(iv);
  }, [text, active]);

  return (
    <div style={{ fontFamily: "Lora, serif", fontSize: 15, lineHeight: 1.8, color: "#0A0A0A", whiteSpace: "pre-wrap" }}>
      {out}
      {out.length < text.length && active && (
        <span style={{ display: "inline-block", width: 2, height: 16, background: "#0A0A0A", verticalAlign: "middle", marginLeft: 2, animation: "pulse 1s infinite" }} />
      )}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function DissectPage() {
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<InputMode>("paste");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<DissectResult | null>(null);
  const [tearing, setTearing] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [scoresOn, setScoresOn] = useState(false);
  const [annoOn, setAnnoOn] = useState(false);
  const [vulnOn, setVulnOn] = useState(false);
  const [brand, setBrand] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [rebuilt, setRebuilt] = useState("");
  const [rebuildOn, setRebuildOn] = useState(false);

  const tear = (fn: () => void) => {
    setTearing(true);
    setTimeout(() => { fn(); setTearing(false); }, 580);
  };

  const reset = () => {
    setResult(null); setCardsReady(false); setScoresOn(false);
    setAnnoOn(false); setVulnOn(false); setRebuilt(""); setRebuildOn(false);
    setBrand(""); setBrandDesc("");
  };

  const handleSubmit = async () => {
    if (!input.trim()) { setError("No evidence submitted."); return; }
    setError(""); setLoading(true); setLoadMsg("EXTRACTING SIGNATURES");

    const ctx = { paste: `Analyze this ad copy:\n${input}`, url: `Fetch and analyze: ${input}`, describe: `Analyze based on description:\n${input}` }[mode];

    try {
      setLoadMsg("PROFILING PSYCHOLOGICAL TRIGGERS · MAPPING EMOTIONAL ARC");
      const raw = await callGemini(`
You are a world-class advertising forensics expert and behavioral psychologist.
${ctx}

Return ONLY valid JSON, no markdown:
{
  "psychology": { "analysis": "2-3 sharp sentences naming the exact psychological principle.", "score": <1-10>, "technique": "Name e.g. Loss Aversion" },
  "emotion": { "analysis": "2-3 sentences tracing the emotional journey.", "score": <1-10>, "arc": "e.g. Anxiety → Relief → Excitement" },
  "narrative": { "analysis": "2-3 sentences on the storytelling framework.", "score": <1-10>, "framework": "e.g. PAS, Hero's Journey" },
  "audience": { "analysis": "2-3 sentences on targeting and identity signals.", "score": <1-10>, "signal": "Key identity signal" },
  "hook": { "analysis": "2-3 sentences on why the opening works.", "score": <1-10>, "type": "Hook type e.g. Pattern Interrupt" },
  "vulnerability": { "analysis": "2-3 sentences on the single biggest weakness a competitor could exploit.", "severity": "LOW|MEDIUM|HIGH|CRITICAL" },
  "overall_verdict": "One punchy sentence max 20 words summarizing effectiveness.",
  "lethality_score": <1-10>,
  "annotations": {
    "hook_phrases": ["exact phrase from input that IS the hook, max 2 items"],
    "psychology_phrases": ["exact phrases triggering psychological response, max 3"],
    "emotion_phrases": ["exact phrases carrying emotional weight, max 3"],
    "cta_phrases": ["exact call-to-action phrases, max 2"]
  }
}`);
      const parsed: DissectResult = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
      tear(() => {
        setStep(2);
        setTimeout(() => { setCardsReady(true); setAnnoOn(true); }, 150);
        setTimeout(() => setScoresOn(true), 500);
        setTimeout(() => setVulnOn(true), 1300);
      });
    } catch (e: any) {
      setError(e.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRebuild = async () => {
    if (!brand || !brandDesc || !result) return;
    setError(""); setLoading(true); setRebuildOn(false); setRebuilt("");
    setLoadMsg("TRANSPLANTING FRAMEWORK · REWRITING");
    try {
      const text = await callGemini(`
You are a master copywriter transplanting a proven ad framework to a new brand.
Framework: Psychology=${result.psychology.technique}, Arc=${result.emotion.arc}, Narrative=${result.narrative.framework}, Hook=${result.hook.type}, Audience=${result.audience.signal}
Brand: ${brand}. Description: ${brandDesc}.
Write a complete social media post using EXACTLY the same framework. 150-250 words.
Output ONLY the ad copy. Nothing else.`);
      setRebuilt(text.trim());
      setRebuildOn(true);
    } catch (e: any) {
      setError(e.message || "Rebuild failed.");
    } finally {
      setLoading(false);
    }
  };

  const SEVCOLOR = { LOW: "#22C55E", MEDIUM: "#F59E0B", HIGH: "#FF6B00", CRITICAL: "#FF2D00" };

  const DIMS = result ? [
    { label: "PSYCHOLOGY", wm: "PSY", badge: result.psychology.technique, text: result.psychology.analysis, score: result.psychology.score },
    { label: "EMOTION ARC", wm: "EMO", badge: result.emotion.arc, text: result.emotion.analysis, score: result.emotion.score },
    { label: "NARRATIVE", wm: "NAR", badge: result.narrative.framework, text: result.narrative.analysis, score: result.narrative.score },
    { label: "AUDIENCE", wm: "AUD", badge: result.audience.signal, text: result.audience.analysis, score: result.audience.score },
    { label: "HOOK", wm: "HOK", badge: result.hook.type, text: result.hook.analysis, score: result.hook.score },
  ] : [];

  // ── RENDER ──
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", color: "#0A0A0A", cursor: "none" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700;1,900&family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

        @keyframes tearL {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-105%); opacity: 0; }
        }
        @keyframes tearR {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(105%); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes vulnSpread {
          0% { width: 4px; background: #FF2D00; }
          60% { width: 100%; background: rgba(255,45,0,0.07); }
          100% { width: 100%; background: rgba(255,45,0,0.04); }
        }
        @keyframes lineSweep {
          0% { left: -100%; } 100% { left: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        .font-display { font-family: 'Playfair Display', serif !important; }
        .font-serif { font-family: 'Lora', serif !important; }
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }

        .fade-up { animation: fadeUp 0.6s ease both; }
        .slide-in { animation: slideIn 0.5s ease both; }

        .ink-input {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(10,10,10,0.12);
          color: #0A0A0A; font-family: 'Lora', serif; font-size: 15px;
          padding: 10px 0; outline: none; resize: none;
          transition: border-color 0.2s;
        }
        .ink-input:focus { border-bottom-color: #0A0A0A; }
        .ink-input::placeholder { color: rgba(10,10,10,0.2); font-style: italic; }

        .btn-ink {
          background: #0A0A0A; color: #FAFAF8;
          font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em; padding: 14px 40px; border: none;
          cursor: none; display: inline-flex; align-items: center; gap: 10px;
          position: relative; overflow: hidden; transition: color 0.3s;
        }
        .btn-ink::after {
          content: ''; position: absolute; inset: 0;
          background: #FF2D00; transform: translateX(-101%);
          transition: transform 0.32s cubic-bezier(0.77,0,0.18,1);
        }
        .btn-ink:hover::after { transform: translateX(0); }
        .btn-ink > * { position: relative; z-index: 1; }
        .btn-ink:disabled { opacity: 0.25; pointer-events: none; }

        .btn-ghost {
          background: transparent; color: rgba(10,10,10,0.3);
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.15em; padding: 8px 16px;
          border: 1px solid rgba(10,10,10,0.1); cursor: none;
          transition: all 0.2s; text-transform: uppercase;
        }
        .btn-ghost:hover { color: #0A0A0A; border-color: rgba(10,10,10,0.4); }

        .mode-tab {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.15em; padding: 7px 18px;
          border: 1px solid rgba(10,10,10,0.1);
          background: transparent; color: rgba(10,10,10,0.3);
          cursor: none; transition: all 0.2s; text-transform: uppercase;
        }
        .mode-tab.active { background: #0A0A0A; color: #FAFAF8; border-color: #0A0A0A; }
        .mode-tab:not(.active):hover { color: #0A0A0A; border-color: rgba(10,10,10,0.4); }

        .evidence-box {
          border: 1px solid rgba(10,10,10,0.1);
          padding: 28px; position: relative;
          background: rgba(10,10,10,0.015);
        }
        .evidence-label {
          position: absolute; top: -9px; left: 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 0.3em; color: rgba(10,10,10,0.3);
          background: #FAFAF8; padding: 0 8px; text-transform: uppercase;
        }

        .dim-row {
          border-bottom: 1px solid rgba(10,10,10,0.08);
          padding: 40px 0; position: relative; overflow: hidden;
          display: grid; grid-template-columns: 220px 1fr 140px; gap: 48px;
          align-items: start;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .dim-row.on { opacity: 1; transform: translateY(0); }

        .dim-wm {
          position: absolute; right: -8px; top: 50%;
          transform: translateY(-50%);
          font-family: 'Playfair Display', serif; font-size: 5.5rem;
          font-weight: 900; color: rgba(10,10,10,0.04);
          pointer-events: none; user-select: none; line-height: 1;
        }

        .vuln-box {
          padding: 32px; border: 1px solid rgba(255,45,0,0.15);
          position: relative; overflow: hidden;
          opacity: 0; transition: opacity 0.5s ease;
        }
        .vuln-box.on { opacity: 1; }
        .vuln-bleed {
          position: absolute; left: 0; top: 0; bottom: 0;
          animation: vulnSpread 1.8s ease forwards;
        }

        .rebuilt-box {
          border: 1px solid rgba(10,10,10,0.08);
          border-left: 3px solid #0A0A0A;
          padding: 28px 32px; position: relative;
        }
        .rebuilt-label {
          position: absolute; top: -9px; left: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 0.3em; color: rgba(10,10,10,0.3);
          background: #FAFAF8; padding: 0 8px; text-transform: uppercase;
        }

        .load-screen {
          position: fixed; inset: 0; z-index: 60;
          background: #FAFAF8; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .load-bar {
          width: 200px; height: 1px; background: rgba(10,10,10,0.1);
          margin-top: 24px; position: relative; overflow: hidden;
        }
        .load-bar::after {
          content: ''; position: absolute; left: -100%; top: 0;
          width: 100%; height: 100%; background: #0A0A0A;
          animation: lineSweep 0.85s ease-in-out infinite;
        }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: rgba(10,10,10,0.1); }
        * { cursor: none !important; }
      `}</style>

      <Cursor />
      <ParticleBg />
      <PageTear active={tearing} />

      {loading && (
        <div className="load-screen">
          <div className="font-display font-black text-6xl italic" style={{ fontFamily: "Playfair Display" }}>
            Analysing<span style={{ color: "#FF2D00" }}>.</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.35em] mt-4 uppercase" style={{ color: "rgba(10,10,10,0.25)" }}>
            {loadMsg}
          </div>
          <div className="load-bar" />
        </div>
      )}

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid rgba(10,10,10,0.07)", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40, background: "rgba(250,250,248,0.92)", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(10,10,10,0.3)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "#0A0A0A")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(10,10,10,0.3)")}>
            ← Back
          </Link>
          <div style={{ width: 1, height: 16, background: "rgba(10,10,10,0.08)" }} />
          <div className="font-display" style={{ fontFamily: "Playfair Display", fontSize: 22, fontWeight: 900, fontStyle: "italic" }}>
            Dissect<span style={{ color: "#FF2D00" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[{ n: 1, l: "Evidence" }, { n: 2, l: "Report" }, { n: 3, l: "Rebuild" }].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span className="font-mono" style={{
                fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.15em",
                color: step === s.n ? "#0A0A0A" : step > s.n ? "rgba(10,10,10,0.25)" : "rgba(10,10,10,0.12)",
                fontWeight: step === s.n ? 700 : 400,
                textDecoration: step > s.n ? "line-through" : "none",
              }}>
                {String(s.n).padStart(2, "0")}
              </span>
              {i < 2 && <div style={{ width: 24, height: 1, background: "rgba(10,10,10,0.08)" }} />}
            </div>
          ))}
        </div>
      </nav>

      {error && (
        <div style={{ margin: "16px 40px", padding: "12px 16px", border: "1px solid rgba(255,45,0,0.2)", background: "rgba(255,45,0,0.04)", fontFamily: "JetBrains Mono", fontSize: 11, color: "#FF2D00", display: "flex", justifyContent: "space-between" }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "rgba(255,45,0,0.4)", fontSize: 14 }}>✕</button>
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 40px 80px", position: "relative", zIndex: 10 }}>

        {/* ══ STEP 1 ══ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 64 }}>
              <div className="font-mono fade-up" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.4em", color: "rgba(10,10,10,0.2)", textTransform: "uppercase", marginBottom: 16, animationDelay: "0.05s" }}>
                Advertising Forensics · 2026
              </div>
              <h1 className="font-display fade-up" style={{
                fontFamily: "Playfair Display", fontWeight: 900,
                fontSize: "clamp(4rem,13vw,10rem)", lineHeight: 0.88,
                letterSpacing: "-0.02em", marginBottom: 24,
                animationDelay: "0.1s",
              }}>
                Dis<span style={{ color: "#FF2D00", fontStyle: "italic" }}>sect</span>
              </h1>
              <p className="font-serif fade-up" style={{ fontFamily: "Lora", fontSize: 15, color: "rgba(10,10,10,0.4)", maxWidth: 460, lineHeight: 1.75, animationDelay: "0.2s" }}>
                Submit any advertisement. The lab exposes every psychological trigger, narrative trick, and hidden weakness — then rebuilds it for your brand.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 36 }} className="fade-up" data-delay="0.3">
              {(["paste", "url", "describe"] as InputMode[]).map(m => (
                <button key={m} className={`mode-tab ${mode === m ? "active" : ""}`} onClick={() => { setMode(m); setInput(""); }}>
                  {m === "paste" ? "Paste Copy" : m === "url" ? "URL" : "Describe"}
                </button>
              ))}
            </div>

            <div className="evidence-box fade-up" style={{ maxWidth: 720, marginBottom: 48, animationDelay: "0.35s" }}>
              <div className="evidence-label">Evidence</div>
              {mode === "paste" && <textarea className="ink-input" rows={9} placeholder="Paste your ad copy — LinkedIn post, TikTok caption, Facebook ad, landing page headline..." value={input} onChange={e => setInput(e.target.value)} />}
              {mode === "url" && (
                <>
                  <input className="ink-input" placeholder="https://example.com/landing-page" value={input} onChange={e => setInput(e.target.value)} />
                  <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, marginTop: 12, color: "rgba(10,10,10,0.2)", letterSpacing: "0.1em" }}>
                    ⚠ Works best with public landing pages. Social media may restrict access.
                  </div>
                </>
              )}
              {mode === "describe" && <textarea className="ink-input" rows={9} placeholder="Describe an ad you saw: what happened, what was said, the mood, visuals, how it made you feel..." value={input} onChange={e => setInput(e.target.value)} />}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="fade-up">
              <button className="btn-ink" onClick={handleSubmit} disabled={!input.trim()}>
                <span>Submit to Lab</span>
                <span style={{ fontSize: 18 }}>→</span>
              </button>
              <span className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "rgba(10,10,10,0.18)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        )}

        {/* ══ STEP 2 ══ */}
        {step === 2 && result && (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(10,10,10,0.08)" }}>
              <div>
                <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.3em", color: "rgba(10,10,10,0.2)", textTransform: "uppercase", marginBottom: 12 }}>
                  Forensic Report · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <h2 className="font-display" style={{ fontFamily: "Playfair Display", fontWeight: 900, fontSize: "clamp(2.5rem,7vw,5rem)", lineHeight: 0.92 }}>
                  Dissection<br />
                  <span style={{ color: "#FF2D00", fontStyle: "italic" }}>Complete.</span>
                </h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "rgba(10,10,10,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                  Lethality Score
                </div>
                <SlotScore score={result.lethality_score} active={scoresOn} />
                <div className="font-serif" style={{ fontFamily: "Lora", fontSize: 13, color: "rgba(10,10,10,0.35)", fontStyle: "italic", marginTop: 4, maxWidth: 280, textAlign: "right" }}>
                  {result.overall_verdict}
                </div>
              </div>
            </div>

            {/* Annotated original */}
            <div style={{ marginBottom: 56 }}>
              <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.3em", color: "rgba(10,10,10,0.2)", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
                Original · Annotated
                <span style={{ display: "flex", gap: 16 }}>
                  {[{ c: "#FF2D00", l: "Hook" }, { c: "#0A0A0A", l: "Psychology" }, { c: "rgba(10,10,10,0.5)", l: "Emotion" }, { c: "#FF2D00", l: "CTA", o: "60%" }].map((x, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ display: "inline-block", width: 14, height: 2, background: x.c, opacity: x.o ? 0.6 : 1 }} />
                      <span style={{ fontSize: 8, color: "rgba(10,10,10,0.25)" }}>{x.l}</span>
                    </span>
                  ))}
                </span>
              </div>
              <div className="evidence-box" style={{ maxWidth: 720 }}>
                <div className="evidence-label">Evidence</div>
                <AnnotatedText text={input} annotations={result.annotations} active={annoOn} />
              </div>
            </div>

            {/* 5 Dimensions */}
            <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.3em", color: "rgba(10,10,10,0.2)", textTransform: "uppercase", marginBottom: 32 }}>
              Five-Dimension Analysis
            </div>

            {DIMS.map((d, i) => (
              <TiltCard key={d.label}>
                <div className={`dim-row ${cardsReady ? "on" : ""}`} style={{ transitionDelay: `${i * 0.11}s` }}>
                  <div className="dim-wm">{d.wm}</div>
                  <div>
                    <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.25em", color: "rgba(10,10,10,0.25)", textTransform: "uppercase", marginBottom: 8 }}>{d.label}</div>
                    <div className="font-display" style={{ fontFamily: "Playfair Display", fontSize: 22, fontWeight: 700, fontStyle: "italic" }}>{d.badge}</div>
                  </div>
                  <div className="font-serif" style={{ fontFamily: "Lora", fontSize: 13, color: "rgba(10,10,10,0.55)", lineHeight: 1.75, borderLeft: "1px solid rgba(10,10,10,0.08)", paddingLeft: 24 }}>
                    {d.text}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <SlotScore score={d.score} active={scoresOn} />
                    <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 8, color: "rgba(10,10,10,0.2)", marginTop: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>Effectiveness</div>
                  </div>
                </div>
              </TiltCard>
            ))}

            {/* Vulnerability */}
            <div className={`vuln-box ${vulnOn ? "on" : ""}`} style={{ marginTop: 0 }}>
              {vulnOn && <div className="vuln-bleed" />}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.3em", color: "#FF2D00", textTransform: "uppercase", marginBottom: 6 }}>
                      Vulnerability Detected
                    </div>
                    <div className="font-display" style={{ fontFamily: "Playfair Display", fontSize: 22, fontWeight: 700, color: "#FF2D00" }}>
                      Critical Weakness
                    </div>
                  </div>
                  <div className="font-mono" style={{
                    fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.15em", padding: "4px 12px",
                    border: `1px solid ${(SEVCOLOR[result.vulnerability.severity] || "#FF2D00") + "40"}`,
                    color: SEVCOLOR[result.vulnerability.severity] || "#FF2D00",
                    background: (SEVCOLOR[result.vulnerability.severity] || "#FF2D00") + "10",
                  }}>
                    {result.vulnerability.severity}
                  </div>
                </div>
                <p className="font-serif" style={{ fontFamily: "Lora", fontSize: 13, color: "rgba(10,10,10,0.55)", lineHeight: 1.75, borderLeft: "2px solid #FF2D00", paddingLeft: 16, maxWidth: 680 }}>
                  {result.vulnerability.analysis}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 24 }}>
              <button className="btn-ink" onClick={() => tear(() => setStep(3))}>
                <span>Rebuild for My Brand</span>
                <span>→</span>
              </button>
              <button className="btn-ghost" onClick={() => { reset(); setStep(1); }}>← New Case</button>
            </div>
          </div>
        )}

        {/* ══ STEP 3 ══ */}
        {step === 3 && result && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 56 }}>
              <div>
                <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.3em", color: "rgba(10,10,10,0.2)", textTransform: "uppercase", marginBottom: 16 }}>
                  Framework Transplant
                </div>
                <h2 className="font-display" style={{ fontFamily: "Playfair Display", fontWeight: 900, fontSize: "clamp(2.5rem,7vw,5rem)", lineHeight: 0.92 }}>
                  Rebuild<br /><span style={{ fontStyle: "italic" }}>Your Ad.</span>
                </h2>
              </div>
              <button className="btn-ghost" style={{ marginTop: 8 }} onClick={() => setStep(2)}>← Report</button>
            </div>

            {/* Framework strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(10,10,10,0.06)", border: "1px solid rgba(10,10,10,0.06)", marginBottom: 56 }}>
              {[
                { l: "Psychology", v: result.psychology.technique },
                { l: "Emotion Arc", v: result.emotion.arc },
                { l: "Framework", v: result.narrative.framework },
                { l: "Hook Type", v: result.hook.type },
              ].map((x, i) => (
                <div key={i} style={{ background: "#FAFAF8", padding: "20px 24px" }}>
                  <div className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "rgba(10,10,10,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{x.l}</div>
                  <div className="font-display" style={{ fontFamily: "Playfair Display", fontSize: 16, fontWeight: 700, fontStyle: "italic" }}>{x.v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 720, marginBottom: 48 }}>
              <div>
                <label className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(10,10,10,0.25)", display: "block", marginBottom: 12 }}>Brand Name *</label>
                <input className="ink-input font-display" placeholder="YOUR BRAND" value={brand} onChange={e => setBrand(e.target.value)} style={{ fontFamily: "Playfair Display", fontStyle: "italic", fontSize: 22, fontWeight: 700 }} />
              </div>
              <div>
                <label className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(10,10,10,0.25)", display: "block", marginBottom: 12 }}>What you sell *</label>
                <input className="ink-input" placeholder="e.g. eco-friendly outdoor furniture" value={brandDesc} onChange={e => setBrandDesc(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 56 }}>
              <button className="btn-ink" onClick={handleRebuild} disabled={!brand || !brandDesc}>
                <span>Initiate Rebuild</span>
                <span>⚡</span>
              </button>
            </div>

            {rebuilt && (
              <div className="rebuilt-box fade-up" style={{ maxWidth: 720 }}>
                <div className="rebuilt-label">Rebuilt Asset</div>
                <RebuildText text={rebuilt} active={rebuildOn} />
                {rebuildOn && (
                  <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(10,10,10,0.07)" }}>
                    <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(rebuilt)}>Copy Output</button>
                    <button className="btn-ghost" onClick={() => { reset(); setInput(""); setStep(1); }}>New Analysis →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(10,10,10,0.06)", padding: "8px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,250,248,0.85)", backdropFilter: "blur(8px)", zIndex: 40 }}>
        <span className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "rgba(10,10,10,0.15)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Dissect · Campaign Forensics v1.0</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
          <span className="font-mono" style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "rgba(10,10,10,0.15)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Gemini Online</span>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}