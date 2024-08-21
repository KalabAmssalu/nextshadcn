import createMiddleware from "next-intl/middleware";
import {
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
} from "../global.il8n";

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames,
});

export default intlMiddleware;

export const config = {
  matcher: [
    // Redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale
    // for all requests that have a locale prefix
    "/(am|en-US)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
