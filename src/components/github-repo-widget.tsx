"use client";

import { useEffect, useState } from "react";

interface GitHubRepo {
	stargazers_count: number;
	forks_count: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

function isValidRepoData(data: unknown): data is GitHubRepo {
	if (!data || typeof data !== "object") {
		return false;
	}

	const repo = data as Record<string, unknown>;
	return (
		typeof repo.stargazers_count === "number"
		&& Number.isFinite(repo.stargazers_count)
		&& typeof repo.forks_count === "number"
		&& Number.isFinite(repo.forks_count)
	);
}

function readCachedRepo() {
	try {
		const cached = localStorage.getItem("github-repo-data");
		const cacheTime = localStorage.getItem("github-repo-cache-time");

		if (!cached || !cacheTime) {
			return null;
		}

		const parsed = JSON.parse(cached);
		const time = Number(cacheTime);

		if (!Number.isFinite(time) || !isValidRepoData(parsed)) {
			return null;
		}

		return { data: parsed, time };
	} catch {
		return null;
	}
}

function writeCachedRepo(data: GitHubRepo) {
	try {
		localStorage.setItem("github-repo-data", JSON.stringify(data));
		localStorage.setItem("github-repo-cache-time", Date.now().toString());
	} catch {
		// Ignore cache write errors (private mode, storage disabled, etc).
	}
}

function formatCount(count: number) {
	return Number.isFinite(count) ? count.toLocaleString() : "—";
}

export function GitHubRepoWidget() {
	const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let ignore = false;
		const cached = readCachedRepo();

		if (cached) {
			setRepoData(cached.data);
			setLoading(false);
		}

		const isCacheFresh = cached && Date.now() - cached.time < CACHE_TTL_MS;
		if (isCacheFresh) {
			return () => {
				ignore = true;
			};
		}

		const controller = new AbortController();
		const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

		const fetchRepo = async () => {
			try {
				const response = await fetch(
					"https://api.github.com/repos/dj-stripe/dj-stripe",
					{
						signal: controller.signal,
						headers: {
							Accept: "application/vnd.github+json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`GitHub API error: ${response.status}`);
				}

				const data = await response.json();
				if (!isValidRepoData(data)) {
					throw new Error("GitHub API returned unexpected data");
				}

				if (!ignore) {
					setRepoData(data);
					writeCachedRepo(data);
				}
			} catch {
				if (!ignore && !cached) {
					setRepoData(null);
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
				window.clearTimeout(timeoutId);
			}
		};

		fetchRepo();

		return () => {
			ignore = true;
			controller.abort();
			window.clearTimeout(timeoutId);
		};
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
							{formatCount(repoData.stargazers_count)}
						</span>
						<span className="flex items-center gap-1">
							<i className="fas fa-code-branch"></i>
							{formatCount(repoData.forks_count)}
						</span>
					</div>
				) : (
					<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
						<span>Unavailable</span>
					</div>
				)}
			</div>
		</a>
	);
}
