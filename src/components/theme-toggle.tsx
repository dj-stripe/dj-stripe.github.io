"use client";

import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isAnimating, setIsAnimating] = useState(false);
	const [displayTheme, setDisplayTheme] = useState<"light" | "dark">("light");

	// Determine what to show based on theme and system preference
	useEffect(() => {
		if (theme === "system") {
			const systemPrefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setDisplayTheme(systemPrefersDark ? "dark" : "light");
		} else {
			setDisplayTheme(theme as "light" | "dark");
		}
	}, [theme]);

	const handleClick = () => {
		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 300);

		// Simple toggle between light and dark, defaulting to system if unset
		if (theme === "light") {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	};

	return (
		<button
			onClick={handleClick}
			className="group relative p-2.5 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 hover:scale-105 active:scale-95"
			aria-label={`Switch to ${displayTheme === "light" ? "dark" : "light"} mode`}
		>
			{/* Background glow effect */}
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/20 to-orange-300/20 dark:from-purple-400/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			{/* Icon container with smooth transitions */}
			<div
				className={`relative transition-all duration-300 ${isAnimating ? "rotate-12 scale-110" : ""}`}
			>
				{/* Light mode - Cute sun */}
				{displayTheme === "light" && (
					<div className="relative w-5 h-5">
						<svg
							className="w-full h-full text-amber-500 transition-all duration-300 drop-shadow-sm"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							{/* Sun center */}
							<circle cx="12" cy="12" r="4" className="animate-pulse" />
							{/* Sun rays */}
							<g
								className="animate-spin"
								style={{
									transformOrigin: "12px 12px",
									animationDuration: "8s",
								}}
							>
								<path
									d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</g>
						</svg>
					</div>
				)}

				{/* Dark mode - Cute moon */}
				{displayTheme === "dark" && (
					<div className="relative w-5 h-5">
						<svg
							className="w-full h-full text-slate-300 transition-all duration-300 drop-shadow-sm"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							{/* Cute stars around moon */}
							<g className="text-yellow-300 animate-pulse">
								<circle cx="6" cy="6" r="0.5" />
								<circle cx="19" cy="8" r="0.5" />
								<circle cx="17" cy="18" r="0.5" />
								<circle cx="4" cy="16" r="0.5" />
							</g>
						</svg>
					</div>
				)}
			</div>

			{/* Tooltip positioned below */}
			<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
				Switch to {displayTheme === "light" ? "dark" : "light"} mode
			</div>
		</button>
	);
}
