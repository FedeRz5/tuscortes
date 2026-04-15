import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — TusCortes",
  description: "Política de privacidad y tratamiento de datos de TusCortes.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Volver al inicio</Link>

        <h1 className="text-3xl font-black mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos para operar el servicio:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Dueños de barberías:</strong> nombre, email, contraseña (encriptada), datos de la barbería.</li>
              <li><strong>Clientes que reservan turno:</strong> nombre, teléfono, email (opcional), datos del turno.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cómo usamos los datos</h2>
            <p>Los datos se usan exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gestionar reservas y enviar confirmaciones por email.</li>
              <li>Enviar recordatorios de turno (cuando están configurados).</li>
              <li>Operar y mejorar el servicio.</li>
            </ul>
            <p className="mt-2">No vendemos ni compartimos tus datos con terceros salvo los proveedores de infraestructura necesarios para operar el servicio (Supabase, Resend, Vercel).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Almacenamiento y seguridad</h2>
            <p>Los datos se almacenan en servidores seguros provistos por Supabase. Las contraseñas se almacenan con hash bcrypt. Implementamos medidas técnicas razonables para proteger la información.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Retención de datos</h2>
            <p>Los datos de turnos se conservan mientras la cuenta esté activa. Al cancelar tu cuenta, podés solicitar la eliminación de tus datos escribiéndonos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Tus derechos</h2>
            <p>Tenés derecho a acceder, corregir o eliminar tus datos personales. Para ejercer estos derechos, contactanos en <a href="mailto:hola@tuscortes.com" className="text-indigo-600 hover:underline">hola@tuscortes.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>Usamos cookies de sesión necesarias para el funcionamiento del panel de administración. No usamos cookies de seguimiento ni publicidad.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contacto</h2>
            <p>Para consultas sobre privacidad, escribinos a <a href="mailto:hola@tuscortes.com" className="text-indigo-600 hover:underline">hola@tuscortes.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
