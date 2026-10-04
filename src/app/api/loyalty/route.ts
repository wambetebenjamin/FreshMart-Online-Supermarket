import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const PHONE_RE = /^[0-9+][0-9 ]{8,14}$/;

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/** GET /api/loyalty?phone=07… — FreshPoints balance lookup. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone") ?? "");
  if (!phone) {
    return NextResponse.json({ error: "Phone parameter is required." }, { status: 400 });
  }
  const raw = await kvGet(`fm:loyalty:${phone}`);
  if (!raw) {
    return NextResponse.json({ error: "No FreshPoints member found for that number." }, { status: 404 });
  }
  try {
    const member = JSON.parse(raw);
    return NextResponse.json({
      memberId: member.memberId,
      name: member.name,
      points: member.points ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Member record is corrupted." }, { status: 500 });
  }
}

/** POST /api/loyalty — join FreshPoints (100 welcome points). */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const phone = normalizePhone(String(body?.phone ?? ""));
  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please provide your full name." }, { status: 400 });
  }
  if (!PHONE_RE.test(body?.phone ?? "") || phone.length < 9) {
    return NextResponse.json({ ok: false, error: "Please provide a valid phone number." }, { status: 400 });
  }

  const key = `fm:loyalty:${phone}`;
  const existing = await kvGet(key);
  if (existing) {
    try {
      const member = JSON.parse(existing);
      return NextResponse.json({
        ok: true,
        memberId: member.memberId,
        name: member.name,
        points: member.points ?? 0,
        existing: true,
      });
    } catch {
      /* recreate below */
    }
  }

  const member = {
    memberId: `FP-${Math.random().toString(36).toUpperCase().slice(2, 7)}`,
    name,
    phone,
    email: email || undefined,
    points: 100, // welcome points
    joinedAt: new Date().toISOString(),
  };
  await kvSet(key, JSON.stringify(member));

  return NextResponse.json({ ok: true, memberId: member.memberId, name, points: member.points });
}
