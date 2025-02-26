function useClipboard() {
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
		});
	};
	return { copyToClipboard };
}

export default useClipboard;
