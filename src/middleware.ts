import { stackMiddlewares } from "./middlewares/stackMiddleware";
import { withAuthentication } from "./middlewares/withAuthentication";
import { withIntl } from "./middlewares/withIntl";
import { withLogging } from "./middlewares/withLogging";

const middleware = [withAuthentication, withIntl, withLogging];
export default stackMiddlewares(middleware);

export const config = {
	matcher: [
		// Redirect to a matching locale at the root
		"/",

		// Set a cookie to remember the previous locale
		// for all requests that have a locale prefix
		"/(am|en-US)/:path*",

		// Enable redirects that add missing locales
		// (e.g. `/pathnames` -> `/en/pathnames`)
		// "/((?!_next|_vercel|.*\\..*).*)",
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
