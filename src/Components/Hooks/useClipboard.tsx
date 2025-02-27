function useClipboard() {
	const copyToClipboard = (text: string) => {
		console.log(text);
		navigator.clipboard.writeText(text).then(() => {
		});
	};
	return { copyToClipboard };
}

export default useClipboard;
