import { metadata } from "./constants/metadata";

export const siteConfig = {
	name: metadata.name,
	appNameDesc: metadata.appNameDesc,
	appPublisher: metadata.appPublisher,
	appVersion: metadata.appVersion,
	author: {
		email: metadata.author.email,
		fullName: metadata.author.fullName,
		handle: metadata.author.handle,
		handleAt: metadata.author.handleAt,
		url: metadata.author.url,
	},
	// socialLinks: {
	//   discord: "",
	//   facebook: "",
	//   github: "",
	//   githubAccount: "",
	//   twitter: "",
	// },
	themeToggleEnabled: true,
} as const;
