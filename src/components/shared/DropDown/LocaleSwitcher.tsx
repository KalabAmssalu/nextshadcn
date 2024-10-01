"use client";

// <-- Explicit import for React
import type { NextPage } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface LocaleSwitcherProps {
	inHamburger?: boolean;
}

const LocaleSwitcher: NextPage<LocaleSwitcherProps> = ({
	inHamburger = false,
}: LocaleSwitcherProps) => {
	const t = useTranslations();
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const localeValue = useLocale();
	const path = usePathname();

	// Safeguard against `undefined`
	const pathName = path?.split("/").pop() ?? "";

	type SupportedLocale = "en-US" | "am";

	const handleChange = (nextLocale: SupportedLocale) => {
		startTransition(() => {
			if (pathName === "en-US" || pathName === "am") {
				router.replace(`/${nextLocale}` as `/${string}`);
			} else {
				router.replace(`/${nextLocale}/${pathName}` as `/${string}`);
				router.refresh();
			}
		});
	};

	return (
		<>
			{/* Mobile view: circular icon */}
			<div className="flex items-center justify-center md:hidden">
				{inHamburger ? (
					<Select
						defaultValue={localeValue}
						disabled={isPending}
						onValueChange={handleChange}
					>
						<SelectTrigger className="w-[100px]">
							<SelectValue placeholder={t("LocaleSwitcher.changeLanguage")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en-US">
								{t("LocaleSwitcher.english")}
							</SelectItem>
							<SelectItem value="am">{t("LocaleSwitcher.amharic")}</SelectItem>
						</SelectContent>
					</Select>
				) : (
					<Avatar
						onClick={() =>
							handleChange(localeValue === "en-US" ? "am" : "en-US")
						}
						className="cursor-pointer"
					>
						<AvatarFallback className="text-xl font-bold">
							{localeValue === "en-US" ? "አ" : "A"}
						</AvatarFallback>
					</Avatar>
				)}
			</div>

			{/* Desktop view: select component */}
			<div className="hidden md:block">
				<Select
					defaultValue={localeValue}
					disabled={isPending}
					onValueChange={handleChange}
				>
					<SelectTrigger className="md:w-[150px]">
						<SelectValue placeholder={t("LocaleSwitcher.changeLanguage")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="en-US">{t("LocaleSwitcher.english")}</SelectItem>
						<SelectItem value="am">{t("LocaleSwitcher.amharic")}</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default LocaleSwitcher;
