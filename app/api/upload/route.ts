import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Validación por magic bytes — no confiar en file.type del cliente
const MAGIC_SIGNATURES: { mime: string; ext: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", ext: "jpg",  bytes: [0xFF, 0xD8, 0xFF] },
  { mime: "image/png",  ext: "png",  bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { mime: "image/gif",  ext: "gif",  bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", ext: "webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
];

function detectMimeType(buf: Buffer): { mime: string; ext: string } | null {
  for (const sig of MAGIC_SIGNATURES) {
    const offset = sig.offset ?? 0;
    const match = sig.bytes.every((b, i) => buf[offset + i] === b);
    if (match) return { mime: sig.mime, ext: sig.ext };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "El archivo supera los 5MB" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verificar magic bytes reales del archivo, ignorando file.type del cliente
  const detected = detectMimeType(buffer);
  if (!detected) return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });

  const filename = `${session.user.id}/${Date.now()}.${detected.ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, buffer, { contentType: detected.mime, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("uploads").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
