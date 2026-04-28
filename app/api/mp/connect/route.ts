import { requireAuth, err } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;
  if (!session.user.organizationId) return err("Sin organización", 403);

  const params = new URLSearchParams({
    client_id: process.env.MP_CLIENT_ID!,
    response_type: "code",
    platform_id: "mp",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp/callback`,
    state: session.user.organizationId,
  });

  return NextResponse.redirect(`https://auth.mercadopago.com/authorization?${params}`);
}
