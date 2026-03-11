export default function OverseasCasePage() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>

      {/* 顶部 Header */}
      <div style={{borderBottom: '4px solid black', padding: '1.5rem 2rem', flexShrink: 0, background: '#F9F9F7'}}>
        <a href="/" style={{fontFamily: 'monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', color: 'black'}}>
          ← Back to Portfolio
        </a>
      </div>

      {/* 工具全屏嵌入 */}
      <iframe
        src="/bub-press-generator.html"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          display: 'block',
          minHeight: 0,
        }}
        title="BuB Press Generator V7.0"
      />

    </div>
  );
}