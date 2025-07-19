"use client";

import { Navigation } from "@/components/navigation";
import Image from "next/image";
import Link from "next/link";

const coreContributors = [
	{
		name: "Alexander Kavanaugh",
		github: "kavdev",
		role: "Co-maintainer",
		avatar: "https://avatars.githubusercontent.com/u/4859329",
		opencollective: "https://opencollective.com/kavdev",
	},
	{
		name: "Jerome Leclanche",
		github: "jleclanche",
		role: "Co-maintainer",
		avatar: "https://avatars.githubusercontent.com/u/235410",
		opencollective: "https://opencollective.com/jleclanche",
	},
	{
		name: "Abe Hanoka",
		github: "abe-101",
		role: "Core Contributor",
		avatar: "https://avatars.githubusercontent.com/u/82916197",
	},
];

const formerCoreContributors = [
	{
		name: "Arnav Choudhury",
		github: "arnav13081994",
		avatar: "https://avatars.githubusercontent.com/u/20695449",
	},
	{
		name: "John Carter",
		github: "therefromhere",
		avatar: "https://avatars.githubusercontent.com/u/197540",
	},
	{
		name: "Pablo Castellano",
		github: "PabloCastellano",
		avatar: "https://avatars.githubusercontent.com/u/73274",
	},
	{
		name: "Daniel Greenfeld",
		github: "pydanny",
		avatar: "https://avatars.githubusercontent.com/u/62857",
	},
	{
		name: "Lee Skillen",
		github: "lskillen",
		avatar: "https://avatars.githubusercontent.com/u/2248287",
	},
];

export default function TeamPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation />

			<main className="container mx-auto px-6 py-16 max-w-6xl">
				<h1 className="text-4xl font-bold text-center mb-12">Meet the Team</h1>

				{/* Core Team */}
				<section className="mb-16">
					<h2 className="text-2xl font-semibold text-center mb-8">
						Core Maintainers
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{coreContributors.map((member) => (
							<div
								key={member.name}
								className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center"
							>
								{member.avatar ? (
									<Image
										src={member.avatar}
										alt={member.name}
										width={128}
										height={128}
										className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"
									/>
								) : (
									<div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
										<span className="text-4xl font-semibold text-gray-600 dark:text-gray-300">
											{member.name.charAt(0)}
										</span>
									</div>
								)}
								<h3 className="text-xl font-semibold mb-1">
									{member.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4">
									{member.role}
								</p>
								<div className="flex gap-4 justify-center">
									{member.github && (
										<a
											href={`https://github.com/${member.github}`}
											className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`${member.name} on GitHub`}
										>
											<svg
												className="w-6 h-6"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
											</svg>
										</a>
									)}
									{member.opencollective && (
										<a
											href={member.opencollective}
											className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`${member.name} on OpenCollective`}
										>
											<svg
												className="w-6 h-6"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.54 0 4.894-.79 6.834-2.135l-3.107-3.109a7.715 7.715 0 1 1 0-13.512l3.107-3.109A11.943 11.943 0 0 0 12 0Z" />
											</svg>
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Former Core Contributors */}
				<section className="mb-16">
					<h2 className="text-2xl font-semibold text-center mb-8">
						Former Core Contributors
					</h2>
					<p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
						We&apos;re grateful to these developers who helped shape
						dj-stripe in its earlier years.
					</p>
					<div className="grid md:grid-cols-5 gap-6 max-w-4xl mx-auto">
						{formerCoreContributors.map((member) => (
							<div key={member.name} className="text-center">
								<a
									href={`https://github.com/${member.github}`}
									target="_blank"
									rel="noopener noreferrer"
									className="block hover:opacity-80 transition-opacity"
								>
									<Image
										src={member.avatar}
										alt={member.name}
										width={80}
										height={80}
										className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gray-200 dark:border-gray-700"
									/>
									<h3 className="text-sm font-semibold">
										{member.name}
									</h3>
								</a>
							</div>
						))}
					</div>
				</section>

				{/* Maintained By */}
				<section className="text-center mb-16">
					<h2 className="text-2xl font-semibold mb-8">Maintained By</h2>
					<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
						<a
							href="https://ingram.tech"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block mb-6 hover:opacity-80 transition-opacity"
						>
							<Image
								src="/ingram-tech-logo.png"
								alt="Ingram Technologies"
								width={300}
								height={80}
								className="mx-auto"
							/>
						</a>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							dj-stripe is proudly maintained by the team at Ingram
							Technologies, an artificial intelligence research &amp;
							development lab based in Belgium.
						</p>
						<a
							href="https://ingram.tech"
							className="text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Visit ingram.tech →
						</a>
					</div>
				</section>

				{/* Contributors */}
				<section className="text-center">
					<h2 className="text-2xl font-semibold mb-8">Contributors</h2>
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 max-w-3xl mx-auto">
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							dj-stripe has been built with contributions from developers
							around the world. We&apos;re grateful to everyone who has
							helped make this project what it is today.
						</p>
						<div className="flex gap-4 justify-center flex-wrap">
							<a
								href="https://github.com/dj-stripe/dj-stripe/graphs/contributors"
								className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
								target="_blank"
								rel="noopener noreferrer"
							>
								View All Contributors
							</a>
							<a
								href="https://github.com/dj-stripe/dj-stripe/blob/master/CONTRIBUTING.md"
								className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								target="_blank"
								rel="noopener noreferrer"
							>
								Become a Contributor
							</a>
						</div>
					</div>
				</section>

				{/* Join the Team */}
				<section className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">Join the Team</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
						We&apos;re always looking for passionate developers to help
						maintain and improve dj-stripe. Whether through code
						contributions, documentation improvements, or community support,
						there&apos;s a place for you on our team.
					</p>
					<Link
						href="/support"
						className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Learn How to Contribute
					</Link>
				</section>
			</main>
		</div>
	);
}
