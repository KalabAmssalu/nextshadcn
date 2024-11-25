import { type NextFetchEvent, type NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";

import {
	defaultLocale,
	localePrefix,
	locales,
	pathnames,
} from "../../global.il8n";
import { type MiddlewareFactory } from "./types";

// Create the `intlMiddleware` from next-intl
const intlBaseMiddleware = createMiddleware({
	defaultLocale,
	locales,
	localePrefix,
	pathnames,
});

// Wrap the `intlMiddleware` to fit into the `stackMiddlewares` pattern
export const withIntl: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		// First, handle locale with intl middleware
		const intlResponse = intlBaseMiddleware(request);

		// If intlMiddleware has handled the request (redirect, response, etc.)
		if (intlResponse) {
			return intlResponse;
		}

		// Otherwise, continue with the next middleware in the stack
		return next(request, _next);
	};
};

// ! OLD CODE
// import createMiddleware from "next-intl/middleware";
// import {
// 	defaultLocale,
// 	localePrefix,
// 	locales,
// 	pathnames,
// } from "../../global.il8n";
// const intlMiddleware = createMiddleware({
// 	defaultLocale,
// 	locales,
// 	localePrefix,
// 	pathnames,
// });
// export default intlMiddleware;
