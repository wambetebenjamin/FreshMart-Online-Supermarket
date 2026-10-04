import { NextResponse } from "next/server";

/**
 * GET /api/weather — optional OpenWeatherMap line for the hero.
 * Set OPENWEATHER_API_KEY to activate. Without a key we return { line: null }
 * and the hero shows its friendly static line instead.
 */
export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return NextResponse.json({ line: null });
  }
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Nairobi,KE&units=metric&appid=${key}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return NextResponse.json({ line: null });
    const json: any = await res.json();
    const temp = Math.round(json?.main?.temp);
    const main = String(json?.weather?.[0]?.main ?? "").toLowerCase();
    const vibe =
      main.includes("rain")
        ? "a great day for hot mandazi and chai"
        : main.includes("cloud")
          ? "still a perfect day for fresh juice"
          : "a perfect day for a fresh juice";
    const hour = new Date().getUTCHours() + 3; // EAT
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return NextResponse.json({ line: `${greeting}, Nairobi — ${temp} degrees, ${vibe}.` });
  } catch {
    return NextResponse.json({ line: null });
  }
}
