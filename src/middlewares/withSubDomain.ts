import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

import { readSiteDomain } from "@/actions/site/read-site-domain";

import { type MiddlewareFactory } from "./types";

export const withSubDomain: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		const url = request.nextUrl;

		const pathname = url.pathname;

		// Get hostname (e.g., 'mike.com', 'test.mike.com')
		const hostname = request.headers.get("host");

		let currentHost: string | undefined;
		if (process.env.NODE_ENV === "production") {
			// In production, extract the subdomain from the base domain
			const baseDomain = process.env.BASE_DOMAIN;
			currentHost = hostname?.replace(`.${baseDomain}`, "");
		} else {
			// In development, handle the local hostname format (e.g., 'test.localhost')
			currentHost = hostname?.split(":")[0].replace(".localhost", "");
		}

		// If there's no subdomain, likely accessing the root domain, continue
		if (!currentHost) {
			console.log("No subdomain detected, continuing with the request.");
			return NextResponse.next();
		}

		// Fetch tenant-specific data based on the hostname
		const response = await readSiteDomain(currentHost);

		// Check if the response is an error object
		if (!Array.isArray(response)) {
			console.log(`Error fetching tenant data: ${response.error}`);
			return NextResponse.next();
		}

		// Handle the case where no domain data is found or the response array is empty
		if (response.length === 0) {
			console.log(`No tenant data found for host: ${currentHost}`);
			return NextResponse.next();
		}

		const site_id = response[0]?.site_id;
		const tenantSubdomain = response[0]?.site_subdomain;
		const mainDomain = response[0]?.site_custom_domain;

		// Determine which domain to use for rewriting
		const rewriteDomain = tenantSubdomain || mainDomain;

		console.log("Hostname:", hostname);
		console.log("Current Host:", currentHost);
		console.log("Rewrite Domain:", rewriteDomain);

		// If we have a rewrite domain, rewrite the URL to the tenant-specific path
		if (rewriteDomain && tenantSubdomain) {
			console.log(
				`>>> Rewriting: ${url.pathname} to ${tenantSubdomain}.${mainDomain}${url.pathname}`
			);
			return NextResponse.rewrite(
				new URL(`${tenantSubdomain}.${pathname}`, request.url)
			);
		}

		// If no rewrite domain is found, continue to the next middleware
		return next(request, _next);
	};
};
