"use client";

import { Navigation } from "@/components/navigation";
import Image from "next/image";

const platinumSponsor = {
	name: "Stripe",
	logo: "/sponsors/stripe_blurple.svg",
	url: "https://stripe.com",
	description: "Online payment processing for internet businesses",
};

const sponsors = [
	{
		name: "BrainHi",
		logo: "/sponsors/brainhi.png",
		url: "https://www.brainhi.com",
		description: "AI-powered patient communication platform",
	},
	{
		name: "Librebor",
		logo: "/sponsors/librebor.png",
		url: "https://librebor.me",
		description: "Open source solutions",
	},
	{
		name: "PodPage",
		logo: "/sponsors/podpage.png",
		url: "https://www.podpage.com",
		description: "Podcast websites made easy",
	},
	{
		name: "PolyRents",
		logo: "/sponsors/polyrents.png",
		url: "https://polyrents.com",
		description: "Property management platform",
	},
	{
		name: "Zeitbyte",
		logo: "/sponsors/zeitbyte.svg",
		url: "https://zeitcaster.com",
		description: "Media and messaging platform",
	},
	{
		name: "Zemtu",
		logo: "/sponsors/zemtu.svg",
		url: "https://zemtu.com",
		description: "Marketing automation tools",
	},
];

export default function SponsorsPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation />

			<main className="container mx-auto px-6 py-16">
				<section className="text-center mb-16">
					<h1 className="text-4xl font-bold mb-4">Our Sponsors</h1>
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						dj-stripe is made possible by the generous support of our
						sponsors
					</p>
				</section>

				{/* Platinum Sponsor */}
				<section className="mb-12 max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-center mb-8">
						Platinum Sponsor
					</h2>
					<a
						href={platinumSponsor.url}
						target="_blank"
						rel="noopener noreferrer"
						className="block p-8 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-xl transition-shadow bg-blue-50 dark:bg-blue-900/20"
					>
						<div className="flex flex-col items-center text-center">
							<div className="h-32 flex items-center justify-center mb-6">
								<Image
									src={platinumSponsor.logo}
									alt={platinumSponsor.name}
									width={200}
									height={80}
									className="object-contain"
								/>
							</div>
							<h3 className="text-2xl font-semibold mb-3">
								{platinumSponsor.name}
							</h3>
							<p className="text-lg text-gray-600 dark:text-gray-400">
								{platinumSponsor.description}
							</p>
						</div>
					</a>
				</section>

				{/* Other Sponsors */}
				<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
					{sponsors.map((sponsor) => (
						<a
							key={sponsor.name}
							href={sponsor.url}
							target="_blank"
							rel="noopener noreferrer"
							className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow"
						>
							<div className="flex flex-col items-center text-center">
								<div className="h-24 flex items-center justify-center mb-4">
									<Image
										src={sponsor.logo}
										alt={sponsor.name}
										width={150}
										height={60}
										className="object-contain"
									/>
								</div>
								<h3 className="text-xl font-semibold mb-2">
									{sponsor.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{sponsor.description}
								</p>
							</div>
						</a>
					))}
				</section>

				{/* Sponsorship Tiers */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-4">
						Become a Sponsor
					</h2>
					<p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
						Since 2014, dj-stripe has been helping Django developers
						integrate Stripe seamlessly. Your sponsorship enables us to
						dedicate real resources to maintaining compatibility with the
						latest Stripe features and providing support to the community.
					</p>

					<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
						{/* Private Backer */}
						<div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold">
									Private Backer
								</h3>
								<span className="text-lg font-bold text-gray-600 dark:text-gray-400">
									$10/mo
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Support the project and help us make dj-stripe even
								better. Every contribution counts!
							</p>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
								<li>• Support open source development</li>
								<li>• Help keep dj-stripe free for everyone</li>
							</ul>
						</div>

						{/* Bronze */}
						<div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold">
									Bronze Sponsor
								</h3>
								<span className="text-lg font-bold text-yellow-700 dark:text-yellow-600">
									$100/mo
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Perfect for companies using dj-stripe in production.
							</p>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
								<li>• Logo on sponsors page</li>
								<li>• Priority issue support</li>
								<li>• Direct developer contact for questions</li>
							</ul>
						</div>

						{/* Silver */}
						<div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6 relative">
							<div className="absolute -top-3 left-6 px-2 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-600 dark:text-gray-400">
								POPULAR
							</div>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold">
									Silver Sponsor
								</h3>
								<span className="text-lg font-bold text-gray-500 dark:text-gray-400">
									$500/mo
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Enhanced support for growing teams and applications.
							</p>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
								<li>• Prominent logo placement</li>
								<li>• Priority issue support</li>
								<li>• Dedicated developer contact</li>
								<li>• Integration assistance</li>
								<li>• Slack/Discord/Email support</li>
							</ul>
						</div>

						{/* Platinum */}
						<div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold">
									Platinum Sponsor
								</h3>
								<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
									$3,000/mo
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Keep dj-stripe thriving and always up-to-date with
								Stripe's API.
							</p>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
								<li>• Premium logo placement</li>
								<li>• Highest priority support</li>
								<li>• Dedicated developer contact</li>
								<li>• Custom feature development</li>
								<li>• Direct influence on roadmap</li>
							</ul>
						</div>
					</div>

					<div className="text-center mt-12">
						<a
							href="https://github.com/sponsors/dj-stripe"
							className="inline-block px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-lg font-medium"
							target="_blank"
							rel="noopener noreferrer"
						>
							Become a Sponsor on GitHub
						</a>
					</div>
				</section>

				{/* Developer Assistance */}
				<section className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
					<h2 className="text-2xl font-bold mb-4">Need Professional Help?</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
						We offer developer assistance contracts for teams needing
						dedicated support with their Stripe integration.
					</p>
					<a
						href="mailto:contact@dj-stripe.dev"
						className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Contact Us at contact@dj-stripe.dev
					</a>
				</section>
			</main>
		</div>
	);
}
