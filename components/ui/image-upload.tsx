"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: "square" | "wide";
}

export function ImageUpload({ value, onChange, label, aspect = "square" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setLoading(false);
    }
  }

  const isWide = aspect === "wide";

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div
        className={`relative group border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors bg-gray-50 ${isWide ? "h-32 w-full" : "h-24 w-24"}`}
        onClick={() => !loading && inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="preview" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-400">
            {loading
              ? <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              : <>
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Subir foto</span>
                </>
            }
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
