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
    content:
      "Los datos se almacenan en servidores seguros provistos por Supabase, ubicados en la región de São Paulo. Las contraseñas se almacenan con hash bcrypt. Implementamos medidas técnicas razonables para proteger tu información.",
  },
  {
    n: "04",
    title: "Retención de datos",
    content:
      "Los datos de turnos se conservan mientras la cuenta esté activa. Al cancelar tu cuenta, podés solicitar la eliminación completa de tus datos escribiéndonos a hola@tuscortes.com.",
  },
  {
    n: "05",
    title: "Tus derechos",
    content: null,
    isContact: true,
    contactText:
      "Tenés derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, contactanos en",
  },
  {
    n: "06",
    title: "Cookies",
    content:
      "Usamos únicamente cookies de sesión necesarias para el funcionamiento del panel de administración. No usamos cookies de seguimiento, analítica de terceros ni publicidad.",
  },
  {
    n: "07",
    title: "Cambios en esta política",
    content:
      "Podemos actualizar esta política ocasionalmente. Ante cambios significativos, te notificaremos por email con al menos 7 días de anticipación.",
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
            <Image src="/logo.png" alt="TusCortes" width={120} height={40} className="h-9 w-auto object-contain" />
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Privacidad y datos
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
            Política de Privacidad
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

              {/* Trust badge */}
              <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-xs font-bold text-green-700">Sin tracking</span>
                </div>
                <p className="text-xs text-green-600 leading-relaxed">
                  No usamos cookies de terceros ni vendemos datos.
                </p>
              </div>
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

                    {s.content && (
                      <p className="text-gray-600 leading-relaxed text-[15px] mb-3">{s.content}</p>
                    )}

                    {s.isList && s.items && (
                      <ul className="flex flex-col gap-2 mb-3">
                        {s.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[15px] text-gray-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                            <span>
                              {item.label && (
                                <strong className="text-gray-800 font-semibold">{item.label}: </strong>
                              )}
                              {item.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {"note" in s && s.note && (
                      <div className="mt-3 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p className="text-sm text-amber-800 leading-relaxed">{s.note}</p>
                      </div>
                    )}

                    {s.isContact && s.contactText && (
                      <p className="text-gray-600 leading-relaxed text-[15px]">
                        {s.contactText}{" "}
                        <a
                          href="mailto:hola@tuscortes.com"
                          className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                        >
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
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TusCortes. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terminos" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Términos y Condiciones
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
