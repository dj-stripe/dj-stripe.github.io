"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GitHubRepoWidget } from "./github-repo-widget";
import { Search } from "./search";
import { ThemeToggle } from "./theme-toggle";

interface NavigationProps {
	className?: string;
	includeSearch?: boolean;
	children?: React.ReactNode;
}

export function Navigation({
	className = "",
	includeSearch = true,
	children,
}: NavigationProps) {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navLinks = [
		{ href: "/about", label: "About" },
		{ href: "/docs/latest", label: "Documentation" },
		{ href: "/changes", label: "Changelog" },
		{ href: "/sponsors", label: "Sponsors" },
		{ href: "/team", label: "Team" },
		{ href: "/support", label: "Support" },
	];

	const isActive = (href: string) => {
		if (href === "/docs/latest") {
			return pathname.startsWith("/docs");
		}
		if (href === "/changes") {
			return pathname.startsWith("/changes");
		}
		return pathname === href;
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<>
			<header
				className={`border-b border-gray-200 dark:border-gray-800 ${className}`}
			>
				<nav className="container mx-auto px-4 sm:px-6 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="text-2xl font-bold z-50">
							dj-<span className="text-stripe-blurple">stripe</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex gap-6 items-center">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={
										isActive(link.href)
											? "text-blue-600 font-semibold"
											: "hover:text-blue-600 transition-colors"
									}
								>
									{link.label}
								</Link>
							))}
							<GitHubRepoWidget />
							{children}
							{includeSearch && <Search />}
							<ThemeToggle />
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={toggleMobileMenu}
							className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50"
							aria-label="Toggle mobile menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isMobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>

					{/* Mobile Menu */}
					{isMobileMenuOpen && (
						<div className="lg:hidden mt-4 pb-4 animate-in slide-in-from-top-2 duration-200 relative z-50">
							<div className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-xl border border-gray-200 dark:border-gray-700">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className={
											isActive(link.href)
												? "text-blue-600 font-semibold px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-900/20"
												: "hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
										}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{link.label}
									</Link>
								))}
								<div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
									<div className="flex gap-3 items-center justify-between px-3">
										<div className="flex gap-3 items-center">
											<GitHubRepoWidget />
											<ThemeToggle />
										</div>
										{includeSearch && <Search />}
									</div>
									{children && (
										<div className="px-3 mt-3">{children}</div>
									)}
								</div>
							</div>
						</div>
					)}
				</nav>
			</header>

			{/* Mobile Menu Backdrop */}
			{isMobileMenuOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black/20 z-30"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
		</>
	);
}
