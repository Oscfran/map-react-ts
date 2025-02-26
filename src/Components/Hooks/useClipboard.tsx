import { useState } from "react";

function useClipboard() {
	const [copied, setCopied] = useState(false);
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); //notifies the correct copy for 2 seconds
		});
	};
	return { copied, copyToClipboard };
}

export default useClipboard;
