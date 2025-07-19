"use client";

import { useEffect } from "react";

export function GitHubButton() {
	useEffect(() => {
		// Load GitHub buttons script
		const script = document.createElement("script");
		script.src = "https://buttons.github.io/buttons.js";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		return () => {
			// Cleanup
			if (document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	return (
		<div className="flex items-center gap-1">
			<a
				className="github-button"
				href="https://github.com/dj-stripe/dj-stripe"
				data-color-scheme="no-preference: light; light: light; dark: dark;"
				data-size="large"
				data-show-count="true"
				aria-label="Star dj-stripe/dj-stripe on GitHub"
			>
				Star
			</a>
		</div>
	);
}
