import Link from "next/link";
import { XCircle } from "lucide-react";

export default function DepositFailurePage() {
  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#111111] mb-2">El pago no se completó</h1>
          <p className="text-black/50 text-sm leading-relaxed">
            El turno no fue reservado. Podés intentarlo de nuevo desde la página de la barbería.
          </p>
        </div>
        <Link href="/" className="inline-block text-sm text-black/40 hover:text-black transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
