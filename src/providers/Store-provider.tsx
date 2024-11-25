"use client";

import { useRef } from "react";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { type AppStore, makeStore } from "../lib/store/store";

export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const storeRef = useRef<AppStore>();
	const persistorRef = useRef<any>();

	if (!storeRef.current) {
		storeRef.current = makeStore();
		persistorRef.current = persistStore(storeRef.current);
	}

	return (
		<Provider store={storeRef.current}>
			{/* Wrap the app with PersistGate to delay rendering until persisted state is rehydrated */}
			<PersistGate loading={null} persistor={persistorRef.current}>
				{children}
			</PersistGate>
		</Provider>
	);
}
