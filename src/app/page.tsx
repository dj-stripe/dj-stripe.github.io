"use client";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import Image from "next/image";
import Link from "next/link";

const features = [
	{
		icon: "fas fa-database",
		title: "Django ORM Integration",
		description:
			"Query Stripe data using Django's ORM. Join Stripe data with your models, build complex queries, and lean on Django's powerful database features.",
	},
	{
		icon: "fas fa-bolt",
		title: "Automatic Webhooks",
		description:
			"Handle Stripe webhooks automatically with signature verification, idempotency, and automatic retries. Never miss an event.",
	},
	{
		icon: "fas fa-diagram-project",
		title: "Django Signals",
		description:
			"Use Django's native signals architecture to implement custom behavior on webhook events. Clean, decoupled, and testable.",
	},
];

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<Navigation className="absolute top-0 left-0 right-0 z-20 border-b-0" />

			{/* Hero Section with Logo Background */}
			<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
				{/* Background Logo */}
				<div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
					<Image
						src="/logo.svg"
						alt=""
						width={800}
						height={800}
						className="select-none"
						priority
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
					<span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur text-sm text-gray-600 dark:text-gray-300">
						<span className="h-2 w-2 rounded-full bg-green-500" />
						Open source &amp; battle-tested since 2014
					</span>
					<h1 className="text-6xl sm:text-7xl font-bold mb-6 tracking-tight">
						dj-<span className="text-stripe-blurple">stripe</span>
					</h1>
					<p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
						Stripe Made Easy for Django Developers
					</p>
					<p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-10">
						The easiest way to integrate Stripe with your Django project.
						Handle payments, subscriptions, and webhooks with just a few
						lines of code.
					</p>
					<div className="flex gap-4 justify-center flex-wrap mb-8">
						<Link
							href="/docs/latest"
							className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg text-lg font-medium"
						>
							Read Documentation
						</Link>
						<a
							href="https://github.com/dj-stripe/dj-stripe"
							className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-lg text-lg font-medium"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fab fa-github" />
							View on GitHub
						</a>
					</div>
					<div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-black/60 border border-gray-800 font-mono text-sm text-gray-100 shadow-md">
						<span className="text-green-400 select-none">$</span>
						<span>pip install dj-stripe</span>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6">
				<div className="container mx-auto max-w-6xl">
					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-8 transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg"
							>
								<div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
									<i className={`${feature.icon} text-xl`} />
								</div>
								<h3 className="text-xl font-semibold mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Code Example */}
			<section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto max-w-4xl">
					<h2 className="text-3xl font-bold text-center mb-12">
						Simple to Use
					</h2>
					<div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 overflow-x-auto shadow-xl border border-gray-200 dark:border-gray-800">
						<pre className="font-mono text-sm">
							<code className="language-python">
								<span className="text-gray-600 dark:text-gray-400">
									# Query Stripe data with Django ORM
								</span>
								{"\n"}
								<span className="text-purple-600 dark:text-purple-400">
									from
								</span>{" "}
								<span className="text-yellow-700 dark:text-yellow-300">
									djstripe.models
								</span>{" "}
								<span className="text-purple-600 dark:text-purple-400">
									import
								</span>{" "}
								<span className="text-blue-600 dark:text-blue-300">
									Customer
								</span>
								,{" "}
								<span className="text-blue-600 dark:text-blue-300">
									Subscription
								</span>
								{"\n\n"}
								<span className="text-gray-800 dark:text-gray-100">
									customer ={" "}
								</span>
								<span className="text-blue-600 dark:text-blue-300">
									Customer
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									.
								</span>
								<span className="text-yellow-700 dark:text-yellow-300">
									objects
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									.
								</span>
								<span className="text-green-600 dark:text-green-300">
									get
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									(email=
								</span>
								<span className="text-orange-600 dark:text-orange-300">
									"user@example.com"
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									)
								</span>
								{"\n"}
								<span className="text-gray-800 dark:text-gray-100">
									active_subs = customer.
								</span>
								<span className="text-yellow-700 dark:text-yellow-300">
									subscriptions
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									.
								</span>
								<span className="text-green-600 dark:text-green-300">
									filter
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									(status=
								</span>
								<span className="text-orange-600 dark:text-orange-300">
									"active"
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									)
								</span>
								{"\n\n"}
								<span className="text-gray-600 dark:text-gray-400">
									# Use Django signals for custom webhook behavior
								</span>
								{"\n"}
								<span className="text-purple-600 dark:text-purple-400">
									from
								</span>{" "}
								<span className="text-yellow-700 dark:text-yellow-300">
									django.dispatch
								</span>{" "}
								<span className="text-purple-600 dark:text-purple-400">
									import
								</span>{" "}
								<span className="text-blue-600 dark:text-blue-300">
									receiver
								</span>
								{"\n"}
								<span className="text-purple-600 dark:text-purple-400">
									from
								</span>{" "}
								<span className="text-yellow-700 dark:text-yellow-300">
									djstripe
								</span>{" "}
								<span className="text-purple-600 dark:text-purple-400">
									import
								</span>{" "}
								<span className="text-blue-600 dark:text-blue-300">
									webhooks
								</span>
								{"\n\n"}
								<span className="text-purple-600 dark:text-purple-400">
									@webhooks.handler
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									(
								</span>
								<span className="text-orange-600 dark:text-orange-300">
									"customer.subscription.created"
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									)
								</span>
								{"\n"}
								<span className="text-purple-600 dark:text-purple-400">
									def
								</span>{" "}
								<span className="text-green-600 dark:text-green-300">
									handle_new_subscription
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									(event):
								</span>
								{"\n"}{" "}
								<span className="text-gray-600 dark:text-gray-400">
									# Automatically synced to your database
								</span>
								{"\n"}{" "}
								<span className="text-gray-800 dark:text-gray-100">
									subscription = event.
								</span>
								<span className="text-yellow-700 dark:text-yellow-300">
									data
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									[
								</span>
								<span className="text-orange-600 dark:text-orange-300">
									"object"
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									]
								</span>
								{"\n"}{" "}
								<span className="text-gray-600 dark:text-gray-400">
									# Your custom business logic here
								</span>
								{"\n"}{" "}
								<span className="text-gray-800 dark:text-gray-100">
									send_welcome_email(subscription.
								</span>
								<span className="text-yellow-700 dark:text-yellow-300">
									customer
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									.
								</span>
								<span className="text-yellow-700 dark:text-yellow-300">
									email
								</span>
								<span className="text-gray-800 dark:text-gray-100">
									)
								</span>
							</code>
						</pre>
					</div>
				</div>
			</section>

			{/* Get Started Section */}
			<section className="py-20 px-6 text-center">
				<div className="container mx-auto max-w-3xl">
					<h2 className="text-3xl font-bold mb-4">
						Get Started with dj-stripe
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						Follow our comprehensive documentation to integrate Stripe into
						your Django project
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							href="/docs/latest/installation"
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Read the Documentation
						</Link>
						<a
							href="https://github.com/dj-stripe/dj-stripe/discussions"
							className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							Join the Community
						</a>
					</div>
				</div>
			</section>

			{/* Sponsorship & Support Section */}
			<section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50 text-center">
				<div className="container mx-auto max-w-3xl">
					<h2 className="text-3xl font-bold mb-4">Support dj-stripe</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						dj-stripe is maintained by volunteers. Your support helps us
						continue development and provide better documentation.
					</p>
					<div className="grid md:grid-cols-2 gap-8 mb-8">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold mb-3">
								Become a Sponsor
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Support the project financially and get your logo on our
								sponsors page
							</p>
							<Link
								href="/sponsors"
								className="text-blue-600 hover:underline"
							>
								View our sponsors →
							</Link>
						</div>
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold mb-3">Contribute</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Help improve dj-stripe by contributing code,
								documentation, or bug reports
							</p>
							<a
								href="https://github.com/dj-stripe/dj-stripe/blob/master/CONTRIBUTING.md"
								className="text-blue-600 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Contributing guide →
							</a>
						</div>
					</div>
					<a
						href="https://github.com/sponsors/dj-stripe"
						className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						Sponsor on GitHub
					</a>
				</div>
			</section>

			<Footer />
		</div>
	);
}
