/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
	experimental: {
		typedRoutes: true,
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
