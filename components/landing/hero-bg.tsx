export function HeroBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 55% at 10% 20%, rgba(231,255,81,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 85% 10%, rgba(231,255,81,0.20) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 60% 80%, rgba(231,255,81,0.12) 0%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}
