import Link from "next/link";

const productLinks = [
	{ href: "/docs/latest", label: "Documentation" },
	{ href: "/docs/latest/installation", label: "Installation" },
	{ href: "/changes", label: "Changelog" },
	{ href: "/about", label: "About" },
];

const communityLinks = [
	{ href: "/team", label: "Team" },
	{ href: "/sponsors", label: "Sponsors" },
	{ href: "/support", label: "Support" },
];

const externalLinks = [
	{ href: "https://github.com/dj-stripe/dj-stripe", label: "GitHub" },
	{ href: "https://pypi.org/project/dj-stripe/", label: "PyPI" },
	{
		href: "https://github.com/dj-stripe/dj-stripe/discussions",
		label: "Discussions",
	},
	{ href: "https://github.com/sponsors/dj-stripe", label: "Sponsor" },
];

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
			<div className="container mx-auto px-6 py-12">
				<div className="grid gap-8 md:grid-cols-4">
					<div className="md:col-span-1">
						<Link href="/" className="text-xl font-bold">
							dj-<span className="text-stripe-blurple">stripe</span>
						</Link>
						<p className="mt-3 max-w-xs text-sm text-gray-500 dark:text-gray-400">
							Stripe made easy for Django developers. Query payments,
							subscriptions, and webhooks with the ORM you already know.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							Product
						</h3>
						<ul className="mt-3 space-y-2">
							{productLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							Community
						</h3>
						<ul className="mt-3 space-y-2">
							{communityLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							Resources
						</h3>
						<ul className="mt-3 space-y-2">
							{externalLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row">
					<p>© {year} dj-stripe. MIT Licensed.</p>
					<p>
						Maintained by{" "}
						<a
							href="https://ingram.tech"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
						>
							Ingram Technologies
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
