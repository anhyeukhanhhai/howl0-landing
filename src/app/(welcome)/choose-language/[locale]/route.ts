import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "vi") {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  const home = locale === "vi" ? "/vi" : "/";
  const requested = request.nextUrl.searchParams.get("next");
  const subpages = [
    "/product",
    "/how-it-works",
    "/why-howl0",
    "/for-you",
    "/people",
    "/faq",
  ];
  const allowed = new Set([
    home,
    `${home}#waitlist`,
    ...subpages.map((path) => (locale === "vi" ? `/vi${path}` : path)),
  ]);
  const destination = requested && allowed.has(requested) ? requested : home;
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.set("howl0-language-choice", locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
