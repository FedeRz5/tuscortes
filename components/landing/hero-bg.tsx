export function HeroBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Gradientes suaves sobre fondo blanco */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 0% 0%, rgba(99,102,241,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 10%, rgba(139,92,246,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
