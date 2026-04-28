import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function DepositSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#111111] mb-2">¡Seña confirmada!</h1>
          <p className="text-black/50 text-sm leading-relaxed">
            Tu turno quedó reservado. Te enviamos una confirmación por email y WhatsApp.
          </p>
        </div>
        <Link href="/" className="inline-block text-sm text-black/40 hover:text-black transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
