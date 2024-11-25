"use server";

import { cookies } from "next/headers";

import { SignJWT, jwtVerify } from "jose";

import axiosInstance from "@/actions/axiosInstance";

import getErrorMessage from "../getErrorMessage";

const SESSION_NAME = "DMS-ADMIN";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export interface ICredentials {
	email: string;
	password: string;
}

let storeEmail: string = "";
export async function setEmail(email: string) {
	storeEmail = email; // Set the value asynchronously
}

export async function getEmail() {
	return storeEmail; // Retrieve the value asynchronously
}

export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 day")
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function get_session() {
	const session = cookies().get(SESSION_NAME)?.value;
	if (!session) return null;

	return await decrypt(session);
}
export async function signUp(credentials: ICredentials) {
	try {
		const response = await axiosInstance.post("auth/signup/", credentials);

		storeEmail = response.data.email;

		return { ok: true, message: response.data.message };
	} catch (error: any) {
		return { ok: false, message: getErrorMessage(error) };
	}
}

export async function signIn(credentials: ICredentials) {
	try {
		const response = await axiosInstance.post("auth/login/", credentials);

		// Access the Tenants
		const tenants = response.data?.tenants;
		let domain = null;

		// If tenants exist, pick the primary domain
		if (tenants && tenants.length > 0) {
			const primaryDomain = tenants[0].domains.find((d: any) => d.is_primary);
			domain = primaryDomain
				? primaryDomain.domain
				: tenants[0].domains[0].domain;
		}

		// Session data
		const sessionId = response.data.session;
		const expires = Date.now() + 24 * 60 * 60 * 1000;

		// Encrypt session with or without tenants
		let session;
		if (tenants) {
			session = await encrypt({ sessionId, expires, domain, tenants });
		} else {
			session = await encrypt({ sessionId, expires, domain });
		}

		// Set session cookie
		cookies().set(SESSION_NAME, session, {
			expires: new Date(expires),
			httpOnly: true,
			sameSite: "lax",
			secure: false, // Change to true in production
		});

		return {
			ok: true,
			message: "እንኳን ደህና መጡ! በተሳካ ሁኔታ ገብተዋል።",
			data: response.data,
		};
	} catch (error: any) {
		// Handle error case
		return { ok: false, message: getErrorMessage(error) };
	}
}

export async function signOut() {
	try {
		await axiosInstance.get("auth/logout/");

		cookies().set(SESSION_NAME, "", { expires: new Date(0) });
	} catch (error: any) {
		throw getErrorMessage(error);
	}
}

export async function get_user() {
	try {
		const response = await axiosInstance.get("auth/me/");
		const data = await response.data;
		return data.data;
	} catch (error: any) {
		throw getErrorMessage(error);
	}
}

export async function requestQRCode() {
	try {
		const response = await axiosInstance.post("auth/qr-code/");

		return { ok: true, message: response.data };
	} catch (error: any) {
		return {
			ok: false,
			message: getErrorMessage(error),
		};
	}
}

export async function validateOneTimePassword(otp: string) {
	try {
		const response = await axiosInstance.post("auth/validate-otp/", { otp });

		return { ok: true, message: response.data };
	} catch (error: any) {
		return {
			ok: false,
			message: getErrorMessage(error),
		};
	}
}

export async function forgotPassword(email: string) {
	try {
		const response = await axiosInstance.post("/auth/forgot-password/", {
			email,
		});
		await setEmail(email);
		console.log(storeEmail);
		return { ok: true, message: response.data };
	} catch (error: any) {
		console.log("failed");
		return {
			ok: false,
			message: getErrorMessage(error),
		};
	}
}

export async function verifyOTP(otpArray: number[]) {
	const email: string = await getEmail();
	console.log("Email retrieved:", email);
	const otp: string = otpArray.join("");
	try {
		console.log("Sending OTP:", otp);
		const response = await axiosInstance.post("/auth/verify-otp/", {
			otp,
			email,
		});
		console.log("Response received:", response.data);
		return { ok: true, message: response.data };
	} catch (error: any) {
		console.error(
			"Error during OTP verification:",
			error.response ? error.response.data : error.message
		);
		return {
			ok: false,
			message: error.response?.data?.message || error.message,
		};
	}
}

export async function resetPassword(
	newPassword: string,
	confirmPassword: string
) {
	const email: string = await getEmail();
	if (newPassword !== confirmPassword) {
		return { ok: false, message: "Passwords do not match" };
	}

	try {
		const response = await axiosInstance.post("/auth/reset-password/", {
			new_password: newPassword,
			email,
		});
		return { ok: true, message: response.data };
	} catch (error: any) {
		return {
			ok: false,
			message: getErrorMessage(error),
		};
	}
}
