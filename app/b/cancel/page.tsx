"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentDetails {
  id: string;
  status: string;
  clientName: string;
  service: string;
  staff: string;
  date: string;
  startTime: string;
  endTime: string;
  orgName: string;
}

export default function CancelPage({ searchParams }: { searchParams: Promise<{ id?: string; token?: string }> }) {
  const [params, setParams] = useState<{ id: string; token: string } | null>(null);
  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    searchParams.then((p) => {
      const id = p.id;
      const token = p.token;
      if (!id || !token) {
        setLoadError("Link inválido.");
        setLoading(false);
        return;
      }
      setParams({ id, token });
      fetch(`/api/public/cancel?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setLoadError(data.error);
          else setDetails(data);
        })
        .catch(() => setLoadError("Error al cargar el turno."))
        .finally(() => setLoading(false));
    });
  }, [searchParams]);

  async function handleCancel() {
    if (!params) return;
    setCancelling(true);
    setCancelError("");
    const res = await fetch("/api/public/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    setCancelling(false);
    if (!res.ok) setCancelError(data.error ?? "Error al cancelar.");
    else setCancelled(true);
  }

  const dateFormatted = details
    ? new Date(details.date + "T00:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md">
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mx-auto" />
            <p className="text-zinc-500 mt-3">Cargando turno...</p>
          </div>
        )}

        {!loading && loadError && (
          <div className="text-center space-y-3">
            <XCircle className="h-14 w-14 text-red-400 mx-auto" />
            <p className="text-zinc-700 font-medium">{loadError}</p>
          </div>
        )}

        {!loading && details && !cancelled && (
          <div className="space-y-5">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-zinc-900">Cancelar turno</h1>
              <p className="text-zinc-500 mt-1 text-sm">¿Estás seguro que querés cancelar este turno?</p>
            </div>

            {details.status === "CANCELLED" ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
                Este turno ya fue cancelado.
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 text-sm">
                  <p className="font-semibold text-zinc-900 text-base">{details.orgName}</p>
                  <Row label="Servicio" value={details.service} />
                  <Row label="Barbero" value={details.staff} />
                  <Row label="Fecha" value={dateFormatted} />
                  <Row label="Horario" value={`${details.startTime} — ${details.endTime}`} />
                </div>

                {cancelError && <p className="text-sm text-red-600 text-center">{cancelError}</p>}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.history.back()}
                    disabled={cancelling}
                  >
                    Volver
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelando..." : "Sí, cancelar"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {cancelled && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-zinc-900">Turno cancelado</h1>
            <p className="text-zinc-500 text-sm">
              Tu turno fue cancelado correctamente. Esperamos verte pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 capitalize">{value}</span>
    </div>
  );
}
