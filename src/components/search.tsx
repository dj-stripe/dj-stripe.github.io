"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
	title: string;
	path: string;
	excerpt: string;
	version: string;
}

export function Search() {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Close search when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchRef.current
				&& !searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			// Cmd/Ctrl + K to open search
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault();
				setIsOpen(true);
				setTimeout(() => inputRef.current?.focus(), 0);
			}
			// Escape to close
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Mock search function - in a real app, this would call an API
	const performSearch = async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		setIsLoading(true);

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Mock search results
		const mockResults: SearchResult[] = [
			{
				title: "Installation",
				path: "/docs/latest/installation",
				excerpt: "Learn how to install dj-stripe using pip or poetry...",
				version: "latest",
			},
			{
				title: "Webhooks",
				path: "/docs/latest/usage/webhooks",
				excerpt: "Configure webhook endpoints to receive events from Stripe...",
				version: "latest",
			},
			{
				title: "Customer Model",
				path: "/docs/latest/reference/models#customer",
				excerpt: "The Customer model represents a Stripe customer object...",
				version: "latest",
			},
			{
				title: "Subscribing Customers",
				path: "/docs/latest/usage/subscribing_customers",
				excerpt: "Guide to creating and managing customer subscriptions...",
				version: "latest",
			},
			{
				title: "API Keys",
				path: "/docs/latest/api_keys",
				excerpt:
					"Configure your Stripe API keys for development and production...",
				version: "latest",
			},
		].filter(
			(result) =>
				result.title.toLowerCase().includes(searchQuery.toLowerCase())
				|| result.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		setResults(mockResults);
		setIsLoading(false);
	};

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			performSearch(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	return (
		<div ref={searchRef} className="relative">
			{/* Search Button */}
			<button
				onClick={() => {
					setIsOpen(true);
					setTimeout(() => inputRef.current?.focus(), 0);
				}}
				className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<span>Search</span>
				<kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
					⌘K
				</kbd>
			</button>

			{/* Search Modal */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-full max-w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
					<div className="p-4 border-b border-gray-200 dark:border-gray-700">
						<div className="relative">
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search documentation..."
								className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
							/>
						</div>
					</div>

					{/* Search Results */}
					<div className="max-h-96 overflow-y-auto">
						{isLoading ? (
							<div className="p-8 text-center text-gray-500 dark:text-gray-400">
								Searching...
							</div>
						) : results.length > 0 ? (
							<ul className="py-2">
								{results.map((result, index) => (
									<li key={index}>
										<Link
											href={result.path}
											onClick={() => {
												setIsOpen(false);
												setQuery("");
											}}
											className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
										>
											<div className="font-medium text-gray-900 dark:text-white">
												{result.title}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{result.excerpt}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
												{result.path}
											</div>
										</Link>
									</li>
								))}
							</ul>
						) : query.trim() ? (
							<div className="p-8 text-center text-gray-500 dark:text-gray-400">
								No results found for "{query}"
							</div>
						) : (
							<div className="p-8 text-center text-gray-500 dark:text-gray-400">
								Start typing to search...
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
						<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
							<div>
								<kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
									↑↓
								</kbd>{" "}
								to navigate
							</div>
							<div>
								<kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
									esc
								</kbd>{" "}
								to close
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
