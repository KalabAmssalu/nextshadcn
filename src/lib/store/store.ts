import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import loadersReducer from "./redux/loadersSlice";
import usersReducer from "./redux/usersSlice";

// Create noop storage for server-side rendering (SSR)
const createNoopStorage = () => {
	return {
		getItem() {
			return Promise.resolve(null);
		},
		setItem(_key: string, value: number) {
			return Promise.resolve(value);
		},
		removeItem() {
			return Promise.resolve();
		},
	};
};

// Use createWebStorage only on the client-side, noop storage for SSR
const storage =
	typeof window !== "undefined"
		? createWebStorage("local")
		: createNoopStorage();

// Combine all reducers into a rootReducer
const rootReducer = combineReducers({
	users: usersReducer,
	loaders: loadersReducer,
});

// Persist configuration
const persistConfig = {
	key: "root",
	storage, // This now depends on whether we're on the client or server
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and create the Redux store
export const makeStore = () => {
	return configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({ serializableCheck: false }),
	});
};

const store = makeStore();

// Create a persistor
export const persistor = persistStore(store);

// Types for store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
