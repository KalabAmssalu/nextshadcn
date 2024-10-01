import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/app";
import LocaleSwitcher from "@/components/shared/DropDown/LocaleSwitcher";
import { ModeToggle } from "@/components/ui/custom/modeToggle";

export async function generateMetadata() {
	// useTranslations works both on the server and client;
	// we only need the getTranslations on async functions.
	const t = await getTranslations();

	const metadata: Metadata = {
		title: `${t("metadata.title.home")} - ${siteConfig.appNameDesc}`,
	};

	return metadata;
}

export default function HomePage() {
	// const t = useTranslations();

	return (
		<div>
			<ModeToggle />
			<span className="flex items-center justify-center gap-2">
				Language Toggle
				<LocaleSwitcher inHamburger={true} />
			</span>
		</div>
	);
}
