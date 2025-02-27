import { useState } from "react";

function useLocalStorage(
	key: string,
	initialValue: { lat: number; lng: number },
) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch {
			console.error("Error reading localStorage");
			return initialValue;
		}
	});
	const setValue = (value: string) => {
		try {
			console.log(value);
			setStoredValue(value);
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			console.error("Error saving to local storage");
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;
