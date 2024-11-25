import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

import { get_session } from "@/actions/auth/action";
import { LOGIN, PUBLIC_ROUTES, ROOT } from "@/lib/routes";

import { type MiddlewareFactory } from "./types";

export const withAuthentication: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		const session = await get_session();
		const isAuthenticated = !!session?.sessionId;

		const { nextUrl } = request;

		const isPublicRoute = PUBLIC_ROUTES.find(
			(route) => nextUrl.pathname.startsWith(route) || nextUrl.pathname === ROOT
		);

		// if (!isAuthenticated && !isPublicRoute) {
		// 	return NextResponse.redirect(new URL(LOGIN, request.url));
		// }
		if (!isAuthenticated && !isPublicRoute) {
			// Prevent redirect loop by checking if the user is already on the login page
			if (nextUrl.pathname !== LOGIN) {
				return NextResponse.redirect(new URL(LOGIN, request.url));
			}
		}

		return next(request, _next);
	};
};
