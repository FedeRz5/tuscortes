import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — TusCortes",
  description: "Términos y condiciones de uso de TusCortes.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Volver al inicio</Link>

        <h1 className="text-3xl font-black mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de los términos</h2>
            <p>Al acceder y utilizar TusCortes, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no deberías usar el servicio.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del servicio</h2>
            <p>TusCortes es una plataforma de gestión de turnos online para barberías. Permite a los dueños de barberías crear una página pública donde sus clientes pueden reservar turnos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Registro y cuentas</h2>
            <p>Para usar TusCortes como barbería necesitás crear una cuenta. Sos responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas desde tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pagos y facturación</h2>
            <p>Los pagos se procesan a través de MercadoPago. Al suscribirte a un plan, aceptás los términos de pago correspondientes. Podés cancelar tu suscripción en cualquier momento desde tu panel.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Uso aceptable</h2>
            <p>Te comprometés a usar TusCortes únicamente para fines legítimos relacionados con la gestión de turnos. Queda prohibido el uso del servicio para actividades ilegales, fraudulentas o que violen derechos de terceros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
            <p>TusCortes no se responsabiliza por interrupciones del servicio, pérdida de datos, o daños indirectos derivados del uso de la plataforma. El servicio se provee "tal cual" sin garantías de disponibilidad continua.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos por email. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contacto</h2>
            <p>Para consultas sobre estos términos, escribinos a <a href="mailto:hola@tuscortes.com" className="text-indigo-600 hover:underline">hola@tuscortes.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
