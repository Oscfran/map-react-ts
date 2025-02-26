import { useEffect, useState } from "react";

function useQueryParameters() {
	const [params, setParams] = useState<URLSearchParams>(
		new URLSearchParams(window.location.search),
	);
	useEffect(() => {
		const updateParams = () =>
			setParams(new URLSearchParams(window.location.search));
		window.addEventListener("popstate", updateParams);
		return () => window.removeEventListener("popstate", updateParams);
	}, []);
	const setQueryParameters = (key: string, value: string) => {
		const newParams = new URLSearchParams(window.location.search);
		newParams.set(key, value);
		window.history.pushState({}, "", `?${newParams.toString()}`);
		setParams(newParams);
	};
	return { params, setQueryParameters };
}
export default useQueryParameters;
