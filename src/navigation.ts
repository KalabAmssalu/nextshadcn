import { createLocalizedPathnamesNavigation } from "next-intl/navigation";

import { localePrefix, locales, pathnames } from "../global.il8n";

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createLocalizedPathnamesNavigation({ locales, pathnames, localePrefix });
