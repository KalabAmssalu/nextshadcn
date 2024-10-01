import type { LocalePrefix, Pathnames } from "next-intl/routing";

// @see i18n-ally.localesPaths in settings.json
export const i18nTheme = "default" as "default" | "toorax";

// Define the supported locales: Amharic and English
export const locales = ["am", "en-US"] as const;

export const localePrefix: LocalePrefix<typeof locales> = "always";

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-US";

export const pathnames: Pathnames<typeof locales> = {
	"/": "/",
	"/donate": {
		"en-US": "/donate",
		am: "/ለመችላት",
	},
	"/pathnames": {
		"en-US": "/pathnames",
		am: "/መንገዶች",
	},
};

export const labels = {
	"en-US": "English",
	am: "Amharic",
};

export const localeFlags: {
	[key in Locale]: string;
} = {
	"en-US": "🇺🇸",
	am: "🇪🇹",
};
