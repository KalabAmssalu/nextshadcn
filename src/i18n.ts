import { notFound } from "next/navigation";

import { getRequestConfig } from "next-intl/server";

import type { Locale } from "../global.il8n";
import { i18nTheme, locales } from "../global.il8n";

export default getRequestConfig(async ({ locale }) => {
	if (!locales.includes(locale as any)) {
		notFound();
	}

	return {
		messages: (
			await (locale === ("en" as Locale)
				? import(`../messages/${i18nTheme}/en-US.json`)
				: import(`../messages/${i18nTheme}/${locale}.json`))
		).default,
	};
});
