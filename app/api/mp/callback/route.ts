import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const orgId = searchParams.get("state");

  if (!code || !orgId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?mp=error`);
  }

  const res = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp/callback`,
    }),
  });

  if (!res.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?mp=error`);
  }

  const data = await res.json();

  await prisma.organization.update({
    where: { id: orgId },
    data: {
      mpAccessToken: data.access_token,
      mpRefreshToken: data.refresh_token,
      mpUserId: String(data.user_id),
    },
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?mp=connected`);
}
