import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — TusCortes",
  description: "Términos y condiciones de uso de TusCortes.",
};

const sections = [
  {
    n: "01",
    title: "Aceptación de los términos",
    content: "Al acceder y utilizar TusCortes, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no deberías usar el servicio.",
  },
  {
    n: "02",
    title: "Descripción del servicio",
    content: "TusCortes es una plataforma de gestión de turnos online para barberías. Permite a los dueños de barberías crear una página pública donde sus clientes pueden reservar turnos de forma autónoma, sin llamadas ni mensajes.",
  },
  {
    n: "03",
    title: "Registro y cuentas",
    content: "Para usar TusCortes como barbería necesitás crear una cuenta. Sos responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas desde tu cuenta. Notificanos de inmediato ante cualquier uso no autorizado.",
  },
  {
    n: "04",
    title: "Pagos y facturación",
    content: "Los pagos se procesan a través de MercadoPago. Al suscribirte a un plan, aceptás los términos de pago correspondientes. Podés cancelar tu suscripción en cualquier momento desde tu panel sin costos adicionales.",
  },
  {
    n: "05",
    title: "Uso aceptable",
    content: "Te comprometés a usar TusCortes únicamente para fines legítimos relacionados con la gestión de turnos. Queda prohibido el uso del servicio para actividades ilegales, fraudulentas o que violen derechos de terceros.",
  },
  {
    n: "06",
    title: "Limitación de responsabilidad",
    content: "TusCortes no se responsabiliza por interrupciones del servicio, pérdida de datos, o daños indirectos derivados del uso de la plataforma. El servicio se provee \"tal cual\" sin garantías de disponibilidad continua.",
  },
  {
    n: "07",
    title: "Modificaciones",
    content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos por email. El uso continuado del servicio implica la aceptación de los nuevos términos.",
  },
  {
    n: "08",
    title: "Contacto",
    content: null,
    isContact: true,
  },
];

export default function TerminosPage() {
  const updatedAt = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#111111]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#F1F1F1]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/Tuscortes-negro.png" alt="TusCortes" width={120} height={40} className="h-8 w-auto object-contain" unoptimized />
          </Link>
          <Link href="/" className="text-sm text-black/50 hover:text-black transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-black/10">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-black/50 mb-5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Documento legal
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Términos y Condiciones</h1>
          <p className="text-black/40 text-sm">Última actualización: <span className="font-medium text-black/60">{updatedAt}</span></p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">

          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="text-[11px] font-semibold text-black/30 uppercase tracking-widest mb-3">Contenido</p>
              <nav className="flex flex-col gap-0.5">
                {sections.map((s) => (
                  <a key={s.n} href={`#sec-${s.n}`}
                    className="text-sm text-black/50 hover:text-black py-1.5 px-3 rounded-lg hover:bg-black/5 transition-colors flex items-center gap-2.5 group">
                    <span className="text-[10px] text-black/25 group-hover:text-[#111111] font-mono">{s.n}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <main className="flex flex-col">
            {sections.map((s, i) => (
              <div key={s.n} id={`sec-${s.n}`}
                className={`py-8 ${i < sections.length - 1 ? "border-b border-black/8" : ""}`}>
                <div className="flex items-start gap-4">
                  <span className="text-[11px] font-mono font-bold text-[#111111] bg-[#E7FF51] px-2 py-1 rounded-lg mt-0.5 shrink-0">
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-[#111111] mb-2">{s.title}</h2>
                    {s.isContact ? (
                      <p className="text-black/60 leading-relaxed text-[15px]">
                        Para consultas sobre estos términos, escribinos a{" "}
                        <a href="mailto:hola@tuscortes.com" className="text-[#111111] font-semibold hover:underline">
                          hola@tuscortes.com
                        </a>
                        . Respondemos en menos de 48 horas hábiles.
                      </p>
                    ) : (
                      <p className="text-black/60 leading-relaxed text-[15px]">{s.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-black/30">© {new Date().getFullYear()} TusCortes. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacidad" className="text-sm text-black/40 hover:text-black transition-colors">Política de Privacidad</Link>
            <Link href="/" className="text-sm text-black/40 hover:text-black transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
