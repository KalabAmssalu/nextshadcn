"use client";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function QueryProviders({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEV_TOOLS === "true" ? (
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-left"
				/>
			) : null}
			{children}
		</QueryClientProvider>
	);
}
