import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — TusCortes",
  description: "Política de privacidad y tratamiento de datos de TusCortes.",
};

const sections = [
  {
    n: "01",
    title: "Datos que recopilamos",
    content: null,
    isList: true,
    items: [
      { label: "Dueños de barberías", desc: "nombre, email, contraseña (encriptada con bcrypt) y datos de la barbería." },
      { label: "Clientes que reservan turno", desc: "nombre, teléfono, email (opcional) y datos del turno solicitado." },
    ],
  },
  {
    n: "02",
    title: "Cómo usamos los datos",
    content: "Los datos se usan exclusivamente para:",
    isList: true,
    items: [
      { label: null, desc: "Gestionar reservas y enviar confirmaciones por email." },
      { label: null, desc: "Enviar recordatorios de turno cuando están configurados." },
      { label: null, desc: "Operar y mejorar el servicio." },
    ],
    note: "No vendemos ni compartimos tus datos con terceros, salvo los proveedores de infraestructura necesarios para operar el servicio.",
  },
  {
    n: "03",
    title: "Almacenamiento y seguridad",
    content: "Los datos se almacenan en servidores seguros provistos por Supabase, ubicados en la región de São Paulo. Las contraseñas se almacenan con hash bcrypt. Implementamos medidas técnicas razonables para proteger tu información.",
  },
  {
    n: "04",
    title: "Retención de datos",
    content: "Los datos de turnos se conservan mientras la cuenta esté activa. Al cancelar tu cuenta, podés solicitar la eliminación completa de tus datos escribiéndonos a hola@tuscortes.com.",
  },
  {
    n: "05",
    title: "Tus derechos",
    content: null,
    isContact: true,
    contactText: "Tenés derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, contactanos en",
  },
  {
    n: "06",
    title: "Cookies",
    content: "Usamos únicamente cookies de sesión necesarias para el funcionamiento del panel de administración. No usamos cookies de seguimiento, analítica de terceros ni publicidad.",
  },
  {
    n: "07",
    title: "Cambios en esta política",
    content: "Podemos actualizar esta política ocasionalmente. Ante cambios significativos, te notificaremos por email con al menos 7 días de anticipación.",
  },
  {
    n: "08",
    title: "Contacto",
    content: null,
    isContact: true,
    contactText: "Para cualquier consulta sobre privacidad o tratamiento de datos, escribinos a",
  },
];

export default function PrivacidadPage() {
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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Privacidad y datos
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Política de Privacidad</h1>
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

              <div className="mt-8 p-4 bg-[#E7FF51]/15 border border-[#E7FF51]/30 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 bg-[#E7FF51] rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-xs font-bold text-[#111111]">Sin tracking</span>
                </div>
                <p className="text-xs text-black/50 leading-relaxed">No usamos cookies de terceros ni vendemos datos.</p>
              </div>
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

                    {s.content && (
                      <p className="text-black/60 leading-relaxed text-[15px] mb-3">{s.content}</p>
                    )}

                    {s.isList && s.items && (
                      <ul className="flex flex-col gap-2 mb-3">
                        {s.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[15px] text-black/60">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0" />
                            <span>
                              {item.label && <strong className="text-[#111111] font-semibold">{item.label}: </strong>}
                              {item.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {"note" in s && s.note && (
                      <div className="mt-3 flex items-start gap-3 bg-black/4 border border-black/8 rounded-xl p-4">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" className="shrink-0 mt-0.5 opacity-40"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p className="text-sm text-black/60 leading-relaxed">{s.note}</p>
                      </div>
                    )}

                    {s.isContact && s.contactText && (
                      <p className="text-black/60 leading-relaxed text-[15px]">
                        {s.contactText}{" "}
                        <a href="mailto:hola@tuscortes.com" className="text-[#111111] font-semibold hover:underline">
                          hola@tuscortes.com
                        </a>
                        . Respondemos en menos de 48 horas hábiles.
                      </p>
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
            <Link href="/terminos" className="text-sm text-black/40 hover:text-black transition-colors">Términos y Condiciones</Link>
            <Link href="/" className="text-sm text-black/40 hover:text-black transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
