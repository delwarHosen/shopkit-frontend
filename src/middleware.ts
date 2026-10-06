import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];

  // /bn/... বা /en/... হলে শুধু পছন্দের ভাষা কুকিতে মনে রাখে
  if (seg && isLocale(seg)) {
    const res = NextResponse.next();
    if (req.cookies.get(LOCALE_COOKIE)?.value !== seg) {
      res.cookies.set(LOCALE_COOKIE, seg, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return res;
  }

  // ভাষা ছাড়া URL হলে কুকি (না থাকলে ডিফল্ট ভাষা) দিয়ে রিডাইরেক্ট
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = saved && isLocale(saved) ? saved : defaultLocale;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// api, _next এবং ডট থাকা ফাইল (manifest, icon, sw.js ইত্যাদি) বাদ
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };