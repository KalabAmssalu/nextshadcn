import type { AxiosInstance } from "axios";
import axios from "axios";

import { get_session } from "./auth/action";

axios.defaults.withCredentials = true;

const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.DJANGO_API_BASE_URL, // Default baseURL for non-tenant requests
	timeout: 20000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Helper function to extract the domain from the Set-Cookie header
const extractSubdomainFromCookies = (
	setCookieHeader: string[]
): string | null => {
	if (setCookieHeader) {
		const cookieString = setCookieHeader[0]; // Assuming the subdomain is in the first cookie
		const domainMatch = cookieString.match(/Domain=([^;]+)/);
		return domainMatch ? domainMatch[1].split(".")[0] : null; // Extract the subdomain (e.g., "client" from "client.example.com")
	}
	return null;
};

// Add a request interceptor to handle session-based subdomains
axiosInstance.interceptors.request.use(
	async (config) => {
		// Handle session authorization
		if (
			!config.url?.includes("auth/login/") &&
			!config.url?.includes("auth/signup/") &&
			!config.url?.includes("auth/forgot-password/") &&
			!config.url?.includes("auth/verify-otp/") &&
			!config.url?.includes("auth/reset-password/")
		) {
			const session = await get_session();
			const sessionId = session?.sessionId;

			if (sessionId) {
				config.headers.Authorization = `Session ${sessionId}`;
			}

			// Extract subdomain from the session response cookies
			const setCookie = session?.response?.headers["set-cookie"]; // Assuming the session response includes the headers
			const subdomain = extractSubdomainFromCookies(setCookie);
			// console.log("subdomain", subdomain);
			if (subdomain) {
				// Update the baseURL with the tenant's subdomain
				config.baseURL = `http://${subdomain}.${process.env.BASE_DOMAIN}`;
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;

// import type { AxiosInstance } from "axios";
// import axios from "axios";

// import { get_session } from "./auth/action";

// axios.defaults.withCredentials = true;

// const axiosInstance: AxiosInstance = axios.create({
// 	baseURL: process.env.DJANGO_API_BASE_URL,
// 	timeout: 20000,
// 	headers: {
// 		"Content-Type": "application/json",
// 	},
// });

// // Add a request interceptor to include the session ID in every request
// axiosInstance.interceptors.request.use(
// 	async (config) => {
// 		if (
// 			!config.url?.includes("auth/login/") &&
// 			!config.url?.includes("auth/signup/") &&
// 			!config.url?.includes("auth/forgot-password/") &&
// 			!config.url?.includes("auth/verify-otp/") &&
// 			!config.url?.includes("auth/reset-password/")
// 		) {
// 			const session = await get_session();
// 			const sessionId = session.sessionId;

// 			if (sessionId) {
// 				config.headers.Authorization = `Session ${sessionId}`;
// 			}
// 		}
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

// export default axiosInstance;
