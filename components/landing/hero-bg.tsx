export function HeroBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 60% at 15% 35%, rgba(231,255,81,0.28) 0%, transparent 70%),
            radial-gradient(ellipse 35% 35% at 80% 8%, rgba(231,255,81,0.10) 0%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}
