"use client";

import { useEffect, useState } from "react";

interface GitHubRepo {
	stargazers_count: number;
	forks_count: number;
}

export function GitHubRepoWidget() {
	const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check cache first
		const cached = localStorage.getItem("github-repo-data");
		const cacheTime = localStorage.getItem("github-repo-cache-time");

		if (cached && cacheTime) {
			const timeDiff = Date.now() - parseInt(cacheTime);
			// Use cache if less than 1 hour old
			if (timeDiff < 3600000) {
				setRepoData(JSON.parse(cached));
				setLoading(false);
				return;
			}
		}

		// Fetch fresh data
		fetch("https://api.github.com/repos/dj-stripe/dj-stripe")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`GitHub API error: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				// Validate the response has expected properties
				if (data && typeof data.stargazers_count === 'number' && typeof data.forks_count === 'number') {
					setRepoData(data);
					// Cache the data
					localStorage.setItem("github-repo-data", JSON.stringify(data));
					localStorage.setItem("github-repo-cache-time", Date.now().toString());
				}
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	return (
		<a
			href="https://github.com/dj-stripe/dj-stripe"
			className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
			target="_blank"
			rel="noopener noreferrer"
		>
			<i className="fab fa-github text-lg sm:text-xl"></i>
			<div className="hidden sm:flex flex-col">
				<span className="text-sm font-medium">dj-stripe</span>
				{loading ? (
					<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
						<span>Loading...</span>
					</div>
				) : repoData ? (
					<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
						<span className="flex items-center gap-1">
							<i className="far fa-star"></i>
							{repoData.stargazers_count.toLocaleString()}
						</span>
						<span className="flex items-center gap-1">
							<i className="fas fa-code-branch"></i>
							{repoData.forks_count.toLocaleString()}
						</span>
					</div>
				) : null}
			</div>
		</a>
	);
}
