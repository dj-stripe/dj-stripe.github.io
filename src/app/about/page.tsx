"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation />

			<main className="container mx-auto px-6 py-16 max-w-4xl">
				<h1 className="text-4xl font-bold mb-8">About dj-stripe</h1>

				<section className="prose prose-lg dark:prose-invert max-w-none">
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						dj-stripe is a comprehensive Django application that integrates
						your Django project with Stripe's payment processing platform.
						It's designed to make working with Stripe in Django as seamless
						as working with any other Django model.
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-4">
						What is dj-stripe?
					</h2>
					<p>
						At its core, dj-stripe is a bridge between Stripe's API and
						Django's ORM. It automatically syncs Stripe objects to your
						local database, allowing you to:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>
							Query Stripe data using Django's ORM instead of making API
							calls
						</li>
						<li>
							Set up database relationships between Stripe objects and
							your models
						</li>
						<li>
							Process webhooks reliably with built-in signature
							verification
						</li>
						<li>
							Handle multiple Stripe accounts in a single Django project
						</li>
						<li>Keep your local data in sync with Stripe automatically</li>
					</ul>

					<h2 className="text-2xl font-semibold mt-12 mb-4">
						Who is it for?
					</h2>
					<p>dj-stripe is perfect for Django developers who:</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>
							<strong>Need reliable webhook processing:</strong> If you're
							building a SaaS application that relies on Stripe events
						</li>
						<li>
							<strong>Want to query payment data efficiently:</strong>{" "}
							When you need to join Stripe data with your application data
						</li>
						<li>
							<strong>Require offline access to payment data:</strong> For
							reporting, analytics, or reduced API dependency
						</li>
						<li>
							<strong>Manage complex subscription logic:</strong> When you
							need to track subscription states and history
						</li>
						<li>
							<strong>Value developer experience:</strong> If you prefer
							Django's ORM over raw API calls
						</li>
					</ul>

					<h2 className="text-2xl font-semibold mt-12 mb-4">
						Our Philosophy
					</h2>
					<p>dj-stripe is built on several core principles:</p>

					<h3 className="text-xl font-semibold mt-8 mb-3">
						1. Local Data Replication
					</h3>
					<p>
						We believe that having Stripe data available locally in your
						database is crucial for building robust applications. This
						approach enables:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>
							Complex queries joining Stripe data with your application
							data
						</li>
						<li>Faster read operations without API rate limits</li>
						<li>Historical data tracking and auditing</li>
						<li>Offline development and testing capabilities</li>
					</ul>

					<h3 className="text-xl font-semibold mt-8 mb-3">
						2. Webhook-First Architecture
					</h3>
					<p>
						Webhooks are the heartbeat of dj-stripe. We've made webhook
						processing a first-class citizen because:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>Real-time synchronization keeps your data fresh</li>
						<li>Event-driven architecture enables reactive applications</li>
						<li>
							Stripe webhooks are the source of truth for state changes
						</li>
						<li>
							Automatic retries and idempotency prevent data
							inconsistencies
						</li>
					</ul>

					<h3 className="text-xl font-semibold mt-8 mb-3">
						3. Django-Native Experience
					</h3>
					<p>
						We've designed dj-stripe to feel like a natural extension of
						Django:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>Models follow Django conventions and best practices</li>
						<li>Seamless integration with Django admin</li>
						<li>Support for Django signals and middleware</li>
						<li>Compatible with Django's migration system</li>
					</ul>

					<h2 className="text-2xl font-semibold mt-12 mb-4">Key Benefits</h2>
					<div className="grid md:grid-cols-2 gap-6 mt-8">
						<div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<h3 className="font-semibold mb-2">Reduced Complexity</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Handle Stripe integration complexity once, at the
								framework level, not in every view or API endpoint.
							</p>
						</div>
						<div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<h3 className="font-semibold mb-2">Better Performance</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Query local data instead of making API calls. Join
								Stripe data with your models efficiently.
							</p>
						</div>
						<div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<h3 className="font-semibold mb-2">Improved Reliability</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Automatic retries, idempotency, and webhook signature
								verification built-in.
							</p>
						</div>
						<div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<h3 className="font-semibold mb-2">Developer Friendly</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Use familiar Django patterns. Extensive documentation
								and active community support.
							</p>
						</div>
					</div>

					<h2 className="text-2xl font-semibold mt-12 mb-4">
						Getting Started
					</h2>
					<p>
						Ready to integrate Stripe with your Django project? Check out
						our{" "}
						<Link
							href="/docs/latest/installation"
							className="text-blue-600 hover:underline"
						>
							installation guide
						</Link>{" "}
						to get started in minutes.
					</p>
				</section>
			</main>
		</div>
	);
}
