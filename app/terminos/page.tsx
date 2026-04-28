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
    content:
      "Al acceder y utilizar TusCortes, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no deberías usar el servicio.",
  },
  {
    n: "02",
    title: "Descripción del servicio",
    content:
      "TusCortes es una plataforma de gestión de turnos online para barberías. Permite a los dueños de barberías crear una página pública donde sus clientes pueden reservar turnos de forma autónoma, sin llamadas ni mensajes.",
  },
  {
    n: "03",
    title: "Registro y cuentas",
    content:
      "Para usar TusCortes como barbería necesitás crear una cuenta. Sos responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas desde tu cuenta. Notificanos de inmediato ante cualquier uso no autorizado.",
  },
  {
    n: "04",
    title: "Pagos y facturación",
    content:
      "Los pagos se procesan a través de MercadoPago. Al suscribirte a un plan, aceptás los términos de pago correspondientes. Podés cancelar tu suscripción en cualquier momento desde tu panel sin costos adicionales.",
  },
  {
    n: "05",
    title: "Uso aceptable",
    content:
      "Te comprometés a usar TusCortes únicamente para fines legítimos relacionados con la gestión de turnos. Queda prohibido el uso del servicio para actividades ilegales, fraudulentas o que violen derechos de terceros.",
  },
  {
    n: "06",
    title: "Limitación de responsabilidad",
    content:
      "TusCortes no se responsabiliza por interrupciones del servicio, pérdida de datos, o daños indirectos derivados del uso de la plataforma. El servicio se provee \"tal cual\" sin garantías de disponibilidad continua.",
  },
  {
    n: "07",
    title: "Modificaciones",
    content:
      "Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos por email. El uso continuado del servicio implica la aceptación de los nuevos términos.",
  },
  {
    n: "08",
    title: "Contacto",
    content: null,
    isContact: true,
  },
];

export default function TerminosPage() {
  const updatedAt = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/Tuscortes-negro.png" alt="TusCortes" width={120} height={40} className="h-9 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Documento legal
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-gray-500 text-sm">
            Última actualización: <span className="font-medium text-gray-700">{updatedAt}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">

          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contenido</p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <a
                    key={s.n}
                    href={`#sec-${s.n}`}
                    className="text-sm text-gray-500 hover:text-indigo-600 py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2.5 group"
                  >
                    <span className="text-xs text-gray-300 group-hover:text-indigo-400 font-mono">{s.n}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <main className="flex flex-col gap-0">
            {sections.map((s, i) => (
              <div
                key={s.n}
                id={`sec-${s.n}`}
                className={`py-8 ${i < sections.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded mt-0.5 shrink-0">
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
                    {s.isContact ? (
                      <p className="text-gray-600 leading-relaxed text-[15px]">
                        Para consultas sobre estos términos, escribinos a{" "}
                        <a
                          href="mailto:hola@tuscortes.com"
                          className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                        >
                          hola@tuscortes.com
                        </a>
                        . Respondemos en menos de 48 horas hábiles.
                      </p>
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-[15px]">{s.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TusCortes. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidad" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Inicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
