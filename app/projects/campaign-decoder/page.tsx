"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================
type InputMode = "url" | "paste" | "describe";
type Step = 1 | 2 | 3;

interface DissectResult {
  psychology: { title: string; analysis: string; score: number; technique: string };
  emotion: { title: string; analysis: string; score: number; arc: string };
  narrative: { title: string; analysis: string; score: number; framework: string };
  audience: { title: string; analysis: string; score: number; signal: string };
  hook: { title: string; analysis: string; score: number; type: string };
  vulnerability: { title: string; analysis: string; severity: string };
  overall_verdict: string;
  lethality_score: number;
}

// ============================================================
// UTILS
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

function cleanJson(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}

// ============================================================
// MATRIX DECODER EFFECT
// ============================================================
function MatrixText({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    if (!active || !text) return;
    setDisplayed("");
    let revealed = 0;
    const interval = setInterval(() => {
      revealed += 2;
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (i < revealed + 8) {
          result += text[i] === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
        } else {
          result += " ";
        }
      }
      setDisplayed(result);
      if (revealed >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text, active]);

  return <span className="font-mono">{displayed || text}</span>;
}

// ============================================================
// SCANLINE ANIMATION
// ============================================================
function ScanLine({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="scanline-beam" />
      <div className="fixed inset-0 bg-[#D4A843]/3 animate-pulse" />
    </div>
  );
}

// ============================================================
// HEARTBEAT SCORE
// ============================================================
function HeartbeatScore({ score, color = "#D4A843" }: { score: number; color?: string }) {
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 120;
    let y = 15;
    const center = 20;
    if (i === center - 2) y = 15;
    else if (i === center - 1) y = 25;
    else if (i === center) y = 2;
    else if (i === center + 1) y = 28;
    else if (i === center + 2) y = 10;
    else if (i === center + 3) y = 15;
    y = y + (Math.random() - 0.5) * (score / 10) * 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex items-center gap-3">
      <svg width="120" height="30" viewBox="0 0 120 30">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
      <span className="font-mono text-lg font-bold" style={{ color }}>
        {score}<span className="text-xs opacity-50">/10</span>
      </span>
    </div>
  );
}

// ============================================================
// DISSECT CARD
// ============================================================
function DissectCard({
  icon, label, badge, analysis, score, meta, index, visible,
}: {
  icon: string; label: string; badge: string; analysis: string;
  score: number; meta: string; index: number; visible: boolean;
}) {
  return (
    <div
      className="dissect-card"
      style={{
        animationDelay: `${index * 0.15}s`,
        opacity: visible ? 1 : 0,
        animation: visible ? `cardReveal 0.5s ease ${index * 0.15}s both` : "none",
      }}
    >
      {/* Classified watermark */}
      <div className="classified-stamp">CLASSIFIED</div>

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{icon}</span>
            <span className="font-display text-xs tracking-[0.2em] text-[#D4A843] uppercase">{label}</span>
          </div>
          <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase">{badge}</div>
        </div>
        <div className="font-mono text-[9px] text-white/20 border border-white/10 px-2 py-1">
          REF-{String(index + 1).padStart(3, "0")}
        </div>
      </div>

      <p className="font-mono text-xs text-[#E8E0CC]/70 leading-relaxed mb-4 border-l border-[#D4A843]/30 pl-3">
        {analysis}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{meta}</div>
        <HeartbeatScore score={score} />
      </div>
    </div>
  );
}

// ============================================================
// VULNERABILITY CARD
// ============================================================
function VulnerabilityCard({ data, visible }: { data: DissectResult["vulnerability"]; visible: boolean }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="vulnerability-card"
      style={{
        opacity: visible ? 1 : 0,
        animation: visible ? "cardReveal 0.6s ease 0.9s both" : "none",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-2 h-2 rounded-full bg-[#CC2200]"
          style={{ opacity: blink ? 1 : 0.2, transition: "opacity 0.3s" }}
        />
        <span className="font-display text-sm tracking-[0.3em] text-[#CC2200] uppercase">
          Vulnerability Detected
        </span>
        <div className="flex-1 h-[1px] bg-[#CC2200]/20" />
        <span className="font-mono text-[9px] text-[#CC2200]/60 border border-[#CC2200]/30 px-2 py-0.5">
          {data.severity}
        </span>
      </div>
      <p className="font-mono text-xs text-[#E8E0CC]/60 leading-relaxed border-l-2 border-[#CC2200]/50 pl-3">
        {data.analysis}
      </p>
    </div>
  );
}

// ============================================================
// TICKER
// ============================================================
function Ticker() {
  const items = [
    "DISSECT LAB · ACTIVE",
    "NEURAL ANALYSIS ENGINE · ONLINE",
    "PATTERN RECOGNITION · ENABLED",
    "PSYCHOLOGICAL PROFILING · READY",
    "VULNERABILITY SCANNER · ARMED",
    "CLASSIFIED CLEARANCE · GRANTED",
  ];
  const text = (items.join("  ·  ") + "  ·  ").repeat(2);
  return (
    <div className="overflow-hidden border-b border-white/5">
      <div
        className="whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-[#D4A843]/40 uppercase py-1.5"
        style={{ animation: "tickerScroll 35s linear infinite", display: "inline-block" }}
      >
        {text}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function DissectPage() {
  const [step, setStep] = useState<Step>(1);
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<DissectResult | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  // Step 3
  const [brandName, setBrandName] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [rebuiltAd, setRebuiltAd] = useState("");
  const [rebuildActive, setRebuildActive] = useState(false);

  // ── DISSECT ──
  const handleSubmit = async () => {
    if (!inputValue.trim()) { setError("No input detected. Submit evidence first."); return; }
    setError("");
    setScanning(true);

    await new Promise(r => setTimeout(r, 1800));
    setScanning(false);
    setLoading(true);
    setLoadingMsg("EXTRACTING PSYCHOLOGICAL SIGNATURES");

    const modeContext = {
      url: `Fetch and analyze the content at this URL: ${inputValue}`,
      paste: `Analyze this advertisement/post copy: ${inputValue}`,
      describe: `Analyze this advertisement based on this description: ${inputValue}`,
    }[inputMode];

    const prompt = `
You are a world-class advertising forensics expert and behavioral psychologist.
Your job is to dissect advertising content and expose exactly why it works (or doesn't).

${modeContext}

Perform a deep forensic analysis across 5 dimensions, then identify a critical vulnerability.
Be specific, sharp, and brutally honest. Reference real psychological principles by name.
Use concise but insightful language — like a senior strategist debriefing a team.

Return ONLY valid JSON, no markdown, no explanation:
{
  "psychology": {
    "title": "Psychological Mechanism",
    "analysis": "2-3 sentences explaining the core psychological trigger used. Name the specific bias or principle.",
    "score": <1-10 integer>,
    "technique": "Name of the psychological technique (e.g. Loss Aversion, Social Proof)"
  },
  "emotion": {
    "title": "Emotional Arc",
    "analysis": "2-3 sentences tracing the emotional journey from opening to CTA.",
    "score": <1-10 integer>,
    "arc": "e.g. Anxiety → Relief → Excitement"
  },
  "narrative": {
    "title": "Narrative Structure",
    "analysis": "2-3 sentences identifying the storytelling framework and how it's deployed.",
    "score": <1-10 integer>,
    "framework": "e.g. PAS (Problem-Agitate-Solution), Hero's Journey"
  },
  "audience": {
    "title": "Audience Targeting",
    "analysis": "2-3 sentences on who this is really speaking to and what identity signals are used.",
    "score": <1-10 integer>,
    "signal": "Key identity signal used (e.g. 'busy professional', 'conscious parent')"
  },
  "hook": {
    "title": "Hook Mechanics",
    "analysis": "2-3 sentences breaking down why the opening grabs attention in the first 3 seconds.",
    "score": <1-10 integer>,
    "type": "Hook type (e.g. Pattern Interrupt, Bold Claim, Question)"
  },
  "vulnerability": {
    "title": "Critical Vulnerability",
    "analysis": "2-3 sentences identifying the single biggest weakness a competitor could exploit or why this ad might fail with certain audiences.",
    "severity": "LOW | MEDIUM | HIGH | CRITICAL"
  },
  "overall_verdict": "One punchy sentence (max 20 words) summarizing the ad's overall strategic approach.",
  "lethality_score": <1-10 integer overall effectiveness score>
}
    `;

    try {
      setLoadingMsg("DECODING NARRATIVE STRUCTURE · PROFILING TARGET AUDIENCE");
      const raw = await callGemini(prompt);
      const parsed: DissectResult = JSON.parse(cleanJson(raw));
      setResult(parsed);
      setStep(2);
      setTimeout(() => setCardsVisible(true), 100);
    } catch (e: any) {
      setError(e.message || "Analysis failed. Check your input.");
    } finally {
      setLoading(false);
    }
  };

  // ── REBUILD ──
  const handleRebuild = async () => {
    if (!brandName || !brandDesc) { setError("Brand name and description required."); return; }
    if (!result) return;
    setError("");
    setLoading(true);
    setRebuildActive(false);
    setRebuiltAd("");
    setLoadingMsg("TRANSPLANTING FRAMEWORK · REWRITING FOR YOUR BRAND");

    const prompt = `
You are a master copywriter. You've just dissected a high-performing advertisement and identified its exact psychological framework.

Original Ad Analysis:
- Psychology: ${result.psychology.technique}
- Emotional Arc: ${result.emotion.arc}
- Narrative Framework: ${result.narrative.framework}
- Hook Type: ${result.hook.type}
- Target Signal: ${result.audience.signal}
- Overall Verdict: ${result.overall_verdict}

Now rewrite a new advertisement using the EXACT SAME framework for this brand:
Brand Name: ${brandName}
Brand Description: ${brandDesc}

Requirements:
- Use identical psychological mechanism: ${result.psychology.technique}
- Mirror the emotional arc: ${result.emotion.arc}
- Apply the same narrative structure: ${result.narrative.framework}
- Use the same hook type: ${result.hook.type}
- But make it 100% authentic to the new brand — no generic language
- Write it as a complete, ready-to-publish social media post
- Length: 150-250 words
- Output ONLY the ad copy, nothing else. No labels, no explanations.
    `;

    try {
      const text = await callGemini(prompt);
      setRebuiltAd(text.trim());
      setRebuildActive(true);
      setStep(3);
    } catch (e: any) {
      setError(e.message || "Rebuild failed.");
    } finally {
      setLoading(false);
    }
  };

  const CARDS = result ? [
    { icon: "🧠", label: "Psychology", badge: result.psychology.technique, analysis: result.psychology.analysis, score: result.psychology.score, meta: "COGNITIVE BIAS PROFILE" },
    { icon: "🎭", label: "Emotion Arc", badge: result.emotion.arc, analysis: result.emotion.analysis, score: result.emotion.score, meta: "EMOTIONAL TRAJECTORY" },
    { icon: "📐", label: "Narrative", badge: result.narrative.framework, analysis: result.narrative.analysis, score: result.narrative.score, meta: "STORY STRUCTURE" },
    { icon: "🎯", label: "Audience", badge: result.audience.signal, analysis: result.audience.analysis, score: result.audience.score, meta: "TARGET PROFILING" },
    { icon: "⚡", label: "Hook", badge: result.hook.type, analysis: result.hook.analysis, score: result.hook.score, meta: "ATTENTION MECHANICS" },
  ] : [];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="dissect-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --bg: #0C0C0A;
          --surface: #111110;
          --gold: #D4A843;
          --gold-dim: rgba(212,168,67,0.08);
          --red: #CC2200;
          --text: #E8E0CC;
          --muted: rgba(232,224,204,0.25);
          --border: rgba(212,168,67,0.12);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dissect-root {
          min-height: 100vh;
          background-color: var(--bg);
          background-image:
            linear-gradient(rgba(212,168,67,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,67,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          color: var(--text);
          font-family: 'Courier Prime', monospace;
          cursor: crosshair;
        }

        .font-display { font-family: 'Archivo Black', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }

        /* Scanline beam */
        .scanline-beam {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          animation: scanDown 1.8s ease-in-out;
          box-shadow: 0 0 20px var(--gold);
        }
        @keyframes scanDown {
          0% { top: -3px; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* Ticker */
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Cards */
        .dissect-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold);
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .dissect-card:hover {
          border-color: rgba(212,168,67,0.4);
          background: rgba(212,168,67,0.03);
        }

        .classified-stamp {
          position: absolute;
          top: 12px; right: -20px;
          font-family: 'Archivo Black', sans-serif;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: var(--red);
          opacity: 0.08;
          transform: rotate(15deg);
          border: 1px solid var(--red);
          padding: 2px 24px;
          pointer-events: none;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Vulnerability card */
        .vulnerability-card {
          background: rgba(204,34,0,0.05);
          border: 1px solid rgba(204,34,0,0.25);
          border-left: 3px solid var(--red);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        /* Input styles */
        .cf-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(212,168,67,0.2);
          color: var(--text);
          font-family: 'Courier Prime', monospace;
          font-size: 14px;
          padding: 10px 0;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
        }
        .cf-input:focus { border-bottom-color: var(--gold); }
        .cf-input::placeholder { color: rgba(232,224,204,0.2); }

        /* Evidence box */
        .evidence-box {
          background: rgba(212,168,67,0.03);
          border: 1px solid rgba(212,168,67,0.15);
          border-left: 3px solid var(--gold);
          padding: 20px;
          position: relative;
        }
        .evidence-box::before {
          content: 'EVIDENCE';
          position: absolute;
          top: -8px; left: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: var(--gold);
          background: var(--bg);
          padding: 0 6px;
        }

        /* Buttons */
        .btn-primary {
          background: var(--gold);
          color: #000;
          font-family: 'Archivo Black', sans-serif;
          font-size: 16px;
          letter-spacing: 0.1em;
          padding: 14px 36px;
          border: none;
          cursor: crosshair;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
        }
        .btn-primary:hover {
          background: var(--text);
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 var(--gold);
        }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-ghost {
          background: transparent;
          color: rgba(232,224,204,0.3);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          padding: 8px 16px;
          border: 1px solid rgba(232,224,204,0.1);
          cursor: crosshair;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .btn-ghost:hover { color: var(--text); border-color: rgba(232,224,204,0.3); }

        /* Mode tabs */
        .mode-tab {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          padding: 6px 14px;
          border: 1px solid rgba(212,168,67,0.15);
          background: transparent;
          color: rgba(212,168,67,0.4);
          cursor: crosshair;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .mode-tab.active {
          background: var(--gold);
          color: #000;
          border-color: var(--gold);
        }
        .mode-tab:not(.active):hover { border-color: rgba(212,168,67,0.4); color: var(--gold); }

        /* Loading */
        .loading-overlay {
          position: fixed; inset: 0;
          background: rgba(12,12,10,0.95);
          z-index: 100;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }
        .loading-bar {
          width: 280px; height: 1px;
          background: rgba(212,168,67,0.1);
          margin-top: 28px;
          position: relative; overflow: hidden;
        }
        .loading-bar::after {
          content: '';
          position: absolute; left: -100%; top: 0;
          width: 100%; height: 100%;
          background: var(--gold);
          animation: loadSweep 1s ease-in-out infinite;
        }
        @keyframes loadSweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Rebuilt ad box */
        .rebuilt-box {
          background: rgba(212,168,67,0.04);
          border: 1px solid rgba(212,168,67,0.2);
          padding: 28px;
          position: relative;
          min-height: 200px;
        }
        .rebuilt-box::before {
          content: 'REBUILT ASSET';
          position: absolute;
          top: -8px; left: 16px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: var(--gold);
          background: var(--bg);
          padding: 0 6px;
        }

        /* Verdict bar */
        .verdict-bar {
          background: rgba(212,168,67,0.06);
          border: 1px solid rgba(212,168,67,0.2);
          border-left: 4px solid var(--gold);
          padding: 16px 20px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.2); }

        a, button, select { cursor: crosshair !important; }

        /* Noise overlay */
        .dissect-root::after {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          z-index: 1;
        }
      `}</style>

      {/* Scan effect */}
      <ScanLine active={scanning} />

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="font-display text-5xl tracking-widest" style={{ color: "var(--gold)", fontFamily: "Archivo Black" }}>
            ANALYZING
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] mt-4 text-center px-8" style={{ color: "rgba(212,168,67,0.4)" }}>
            {loadingMsg}
          </div>
          <div className="loading-bar" />
          <div className="font-mono text-[9px] mt-6 tracking-widest" style={{ color: "rgba(212,168,67,0.25)" }}>
            GEMINI 2.5 FLASH · FORENSIC MODE
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="border-b sticky top-0 z-40 backdrop-blur-sm px-6 py-3 flex items-center justify-between"
        style={{ borderColor: "rgba(212,168,67,0.1)", background: "rgba(12,12,10,0.9)" }}>
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-[10px] tracking-widest uppercase transition-colors"
            style={{ color: "rgba(232,224,204,0.25)" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(232,224,204,0.25)")}>
            ← BACK
          </Link>
          <div className="w-[1px] h-4" style={{ background: "rgba(212,168,67,0.15)" }} />
          <div className="font-display text-xl tracking-widest" style={{ color: "var(--gold)", fontFamily: "Archivo Black" }}>
            DISSECT
          </div>
          <div className="font-mono text-[9px] tracking-widest hidden md:block" style={{ color: "rgba(212,168,67,0.3)" }}>
            CAMPAIGN DECODER · LAB #0047
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[
            { n: 1, label: "SUBMIT" },
            { n: 2, label: "DISSECT" },
            { n: 3, label: "REBUILD" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className="font-mono text-[9px] tracking-widest px-2 py-1 transition-all"
                style={{
                  color: step === s.n ? "#000" : step > s.n ? "var(--gold)" : "rgba(232,224,204,0.15)",
                  background: step === s.n ? "var(--gold)" : "transparent",
                }}>
                {String(s.n).padStart(2, "0")} <span className="hidden md:inline">{s.label}</span>
              </div>
              {i < 2 && <div className="w-4 h-[1px]" style={{ background: step > s.n + 1 ? "var(--gold)" : "rgba(255,255,255,0.08)" }} />}
            </div>
          ))}
        </div>
      </nav>

      <Ticker />

      {/* ── MAIN ── */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 font-mono text-xs flex items-center justify-between"
            style={{ border: "1px solid rgba(204,34,0,0.4)", background: "rgba(204,34,0,0.05)", color: "#CC2200" }}>
            <span>⚠ {error}</span>
            <button onClick={() => setError("")} style={{ color: "rgba(204,34,0,0.5)" }}>✕</button>
          </div>
        )}

        {/* ══════════════════════════════
            STEP 1: SUBMIT EVIDENCE
        ══════════════════════════════ */}
        {step === 1 && (
          <div>
            <div className="mb-12">
              <div className="font-mono text-[10px] tracking-[0.3em] mb-3" style={{ color: "rgba(212,168,67,0.4)" }}>
                FORENSIC ADVERTISING ANALYSIS
              </div>
              <h1 className="font-display leading-none mb-3" style={{ fontFamily: "Archivo Black", fontSize: "clamp(3rem, 10vw, 7rem)", color: "var(--text)", lineHeight: 1 }}>
                SUBMIT<br />
                <span style={{ color: "var(--gold)" }}>EVIDENCE</span>
              </h1>
              <p className="font-mono text-xs leading-relaxed max-w-xl" style={{ color: "rgba(232,224,204,0.35)" }}>
                Paste an ad, a URL, or describe what you saw. The lab will dissect it — exposing every psychological trigger, narrative trick, and hidden weakness.
              </p>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2 mb-8">
              {(["paste", "url", "describe"] as InputMode[]).map(mode => (
                <button
                  key={mode}
                  className={`mode-tab ${inputMode === mode ? "active" : ""}`}
                  onClick={() => { setInputMode(mode); setInputValue(""); }}
                >
                  {mode === "paste" && "📋 Paste Copy"}
                  {mode === "url" && "🔗 URL"}
                  {mode === "describe" && "📝 Describe"}
                </button>
              ))}
            </div>

            {/* Evidence box */}
            <div className="evidence-box mb-8 max-w-3xl">
              {inputMode === "paste" && (
                <>
                  <div className="font-mono text-[9px] tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.4)" }}>
                    PASTE ADVERTISEMENT COPY BELOW
                  </div>
                  <textarea
                    className="cf-input"
                    rows={8}
                    placeholder="Paste your ad copy, LinkedIn post, TikTok caption, Facebook ad, email subject line..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </>
              )}
              {inputMode === "url" && (
                <>
                  <div className="font-mono text-[9px] tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.4)" }}>
                    TARGET URL
                  </div>
                  <input
                    className="cf-input"
                    placeholder="https://example.com/landing-page"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                  <div className="font-mono text-[9px] mt-3" style={{ color: "rgba(212,168,67,0.25)" }}>
                    ⚠ Works best with public landing pages and blog posts. Social media posts may have limited access.
                  </div>
                </>
              )}
              {inputMode === "describe" && (
                <>
                  <div className="font-mono text-[9px] tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.4)" }}>
                    DESCRIBE THE ADVERTISEMENT
                  </div>
                  <textarea
                    className="cf-input"
                    rows={8}
                    placeholder="Describe a video ad you saw: what happened, what was said, the visuals, the music, how it made you feel..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-6">
              <button className="btn-primary" onClick={handleSubmit} disabled={!inputValue.trim()}>
                SUBMIT TO LAB
                <span style={{ fontSize: "12px", opacity: 0.6 }}>⚡</span>
              </button>
              <div className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(212,168,67,0.2)" }}>
                ANALYSIS TAKES 10-20 SECONDS
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            STEP 2: DISSECT RESULTS
        ══════════════════════════════ */}
        {step === 2 && result && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>
                  FORENSIC REPORT · CASE #{Date.now().toString().slice(-6)}
                </div>
                <h1 className="font-display leading-none" style={{ fontFamily: "Archivo Black", fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "var(--text)", lineHeight: 1 }}>
                  DISSECTION<br />
                  <span style={{ color: "var(--gold)" }}>COMPLETE</span>
                </h1>
              </div>
              <button className="btn-ghost mt-4" onClick={() => { setStep(1); setResult(null); setCardsVisible(false); }}>
                ← NEW CASE
              </button>
            </div>

            {/* Overall verdict */}
            <div className="verdict-bar mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: "rgba(212,168,67,0.4)" }}>
                  OVERALL VERDICT
                </div>
                <div className="font-mono text-sm" style={{ color: "var(--text)" }}>
                  {result.overall_verdict}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: "rgba(212,168,67,0.4)" }}>
                  LETHALITY SCORE
                </div>
                <HeartbeatScore score={result.lethality_score} color="var(--gold)" />
              </div>
            </div>

            {/* 5 dissect cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/5 mb-[1px]">
              {CARDS.map((card, i) => (
                <DissectCard key={i} {...card} index={i} visible={cardsVisible} />
              ))}
              {/* Empty fill for grid */}
              <div style={{ background: "var(--surface)" }} />
            </div>

            {/* Vulnerability */}
            <VulnerabilityCard data={result.vulnerability} visible={cardsVisible} />

            {/* CTA to rebuild */}
            <div className="mt-10 flex items-center gap-6">
              <button className="btn-primary" onClick={() => setStep(3)}>
                REBUILD FOR MY BRAND
                <span style={{ fontSize: "12px", opacity: 0.6 }}>→</span>
              </button>
              <div className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(212,168,67,0.25)" }}>
                TRANSPLANT THIS FRAMEWORK TO YOUR BRAND
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            STEP 3: REBUILD
        ══════════════════════════════ */}
        {step === 3 && (
          <div>
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>
                  FRAMEWORK TRANSPLANT
                </div>
                <h1 className="font-display leading-none" style={{ fontFamily: "Archivo Black", fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "var(--text)", lineHeight: 1 }}>
                  REBUILD<br />
                  <span style={{ color: "var(--gold)" }}>YOUR AD</span>
                </h1>
              </div>
              <button className="btn-ghost mt-4" onClick={() => setStep(2)}>← BACK TO REPORT</button>
            </div>

            {/* Framework summary */}
            {result && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/5 mb-8">
                {[
                  { label: "Psychology", val: result.psychology.technique },
                  { label: "Emotion Arc", val: result.emotion.arc },
                  { label: "Framework", val: result.narrative.framework },
                  { label: "Hook Type", val: result.hook.type },
                ].map((item, i) => (
                  <div key={i} className="p-4" style={{ background: "var(--surface)" }}>
                    <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: "rgba(212,168,67,0.35)" }}>
                      {item.label}
                    </div>
                    <div className="font-mono text-xs" style={{ color: "var(--gold)" }}>{item.val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Brand input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mb-8">
              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: "rgba(212,168,67,0.35)" }}>
                  Brand Name *
                </label>
                <input
                  className="cf-input font-display text-xl"
                  placeholder="YOUR BRAND"
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  style={{ fontFamily: "Archivo Black" }}
                />
              </div>
              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase block mb-2" style={{ color: "rgba(212,168,67,0.35)" }}>
                  What you sell / do *
                </label>
                <input
                  className="cf-input"
                  placeholder="e.g. eco-friendly outdoor furniture for families"
                  value={brandDesc}
                  onChange={e => setBrandDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-10">
              <button className="btn-primary" onClick={handleRebuild} disabled={!brandName || !brandDesc}>
                INITIATE REBUILD
                <span style={{ fontSize: "12px", opacity: 0.6 }}>⚡</span>
              </button>
            </div>

            {/* Rebuilt output */}
            {rebuiltAd && (
              <div className="rebuilt-box max-w-3xl">
                <div className="font-mono text-xs leading-relaxed" style={{ color: "var(--text)", minHeight: "120px" }}>
                  <MatrixText text={rebuiltAd} active={rebuildActive} />
                </div>
                {rebuildActive && (
                  <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: "1px solid rgba(212,168,67,0.1)" }}>
                    <button
                      onClick={() => navigator.clipboard.writeText(rebuiltAd)}
                      className="btn-ghost text-[10px]"
                    >
                      COPY OUTPUT
                    </button>
                    <button className="btn-ghost" onClick={() => { setStep(1); setResult(null); setRebuiltAd(""); setBrandName(""); setBrandDesc(""); setCardsVisible(false); }}>
                      NEW ANALYSIS →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t px-6 py-2 flex items-center justify-between backdrop-blur-sm z-40"
        style={{ borderColor: "rgba(212,168,67,0.08)", background: "rgba(12,12,10,0.9)" }}>
        <div className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(212,168,67,0.2)" }}>
          DISSECT · CAMPAIGN DECODER V1.0
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: "pulse 2s infinite" }} />
          <span className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(212,168,67,0.2)" }}>
            GEMINI FORENSICS · ONLINE
          </span>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
}