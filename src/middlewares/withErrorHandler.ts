import { type NextFetchEvent, type NextRequest } from "next/server";

import { type MiddlewareFactory } from "./types";

export const withErrorHandler: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		try {
			await next(request, _next);
		} catch (error) {
			if (error instanceof Error) {
				console.log("withErrorHandler", error.message);
			}
		}
	};
};
