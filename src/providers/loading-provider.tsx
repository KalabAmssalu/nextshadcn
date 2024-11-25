"use client";

import Loader from "@/components/shared/loader/Loader";
import { useAppSelector } from "@/hooks/storehooks";
import { type RootState } from "@/lib/store/store";

const LoadingProvider = () => {
	const { loading } = useAppSelector((state: RootState) => state.loaders);

	return <>{loading && <Loader />}</>;
};

export default LoadingProvider;
