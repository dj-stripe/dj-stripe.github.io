"use client";

import { Navigation } from "@/components/navigation";
import Link from "next/link";

export default function SupportPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation />

			<main className="container mx-auto px-6 py-16 max-w-4xl">
				<h1 className="text-4xl font-bold mb-8">Getting Support</h1>

				<div className="prose prose-lg dark:prose-invert max-w-none">
					<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
						There are several ways to get help with dj-stripe, from
						community support to dedicated developer assistance.
					</p>

					{/* Community Support */}
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Community Support
						</h2>
						<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
							<p className="mb-4">
								For general questions, bug reports, and feature
								requests, the dj-stripe community is here to help:
							</p>
							<ul className="space-y-3">
								<li className="flex items-start">
									<span className="text-green-600 mr-2">•</span>
									<div>
										<strong>GitHub Issues:</strong> Report bugs or
										request features on our{" "}
										<a
											href="https://github.com/dj-stripe/dj-stripe/issues"
											className="text-blue-600 hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											GitHub Issues page
										</a>
									</div>
								</li>
								<li className="flex items-start">
									<span className="text-green-600 mr-2">•</span>
									<div>
										<strong>Discussions:</strong> Ask questions and
										share ideas in{" "}
										<a
											href="https://github.com/dj-stripe/dj-stripe/discussions"
											className="text-blue-600 hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											GitHub Discussions
										</a>
									</div>
								</li>
								<li className="flex items-start">
									<span className="text-green-600 mr-2">•</span>
									<div>
										<strong>Documentation:</strong> Find answers in
										our{" "}
										<Link
											href="/docs/latest"
											className="text-blue-600 hover:underline"
										>
											comprehensive documentation
										</Link>
									</div>
								</li>
							</ul>
						</div>
					</section>

					{/* Priority Support for Sponsors */}
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Priority Support for Sponsors
						</h2>
						<div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
							<p className="mb-4">
								<strong>
									Get dedicated developer support by becoming a
									sponsor!
								</strong>
							</p>
							<p className="mb-6">
								Our sponsors receive priority support with guaranteed
								response times and direct access to dj-stripe
								maintainers. This is perfect for businesses that rely on
								dj-stripe for their payment infrastructure.
							</p>

							<div className="grid md:grid-cols-2 gap-4 mb-6">
								<div className="bg-white dark:bg-gray-800 rounded p-4">
									<h3 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-600">
										Bronze ($100/mo)
									</h3>
									<ul className="text-sm space-y-1">
										<li>• Priority issue handling</li>
										<li>• Direct developer contact</li>
									</ul>
								</div>
								<div className="bg-white dark:bg-gray-800 rounded p-4">
									<h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-400">
										Silver ($500/mo)
									</h3>
									<ul className="text-sm space-y-1">
										<li>• Everything in Bronze</li>
										<li>• Dedicated support channel</li>
										<li>• Integration assistance</li>
									</ul>
								</div>
							</div>

							<div className="text-center">
								<Link
									href="/sponsors"
									className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									View All Sponsorship Tiers
								</Link>
							</div>
						</div>
					</section>

					{/* Professional Services */}
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Professional Services
						</h2>
						<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
							<p className="mb-4">
								Need help with a specific integration or custom
								development? We offer professional consulting services
								for teams that need:
							</p>
							<ul className="space-y-2 mb-6">
								<li>• Custom Stripe integration development</li>
								<li>• Migration from other payment systems</li>
								<li>• Performance optimization</li>
								<li>• Architecture review and recommendations</li>
								<li>• Training for your development team</li>
							</ul>
							<div className="text-center">
								<a
									href="mailto:contact@dj-stripe.dev"
									className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
								>
									Contact Us for a Quote
								</a>
							</div>
						</div>
					</section>

					{/* Best Practices */}
					<section>
						<h2 className="text-2xl font-semibold mb-4">
							Getting the Best Support
						</h2>
						<p className="mb-4">To help us help you more effectively:</p>
						<ul className="space-y-3">
							<li>
								<strong>Search first:</strong> Check if your question
								has already been answered in the documentation or
								existing issues
							</li>
							<li>
								<strong>Provide context:</strong> Include your Django
								version, dj-stripe version, and relevant code snippets
							</li>
							<li>
								<strong>Be specific:</strong> Clearly describe what
								you're trying to achieve and what's not working
							</li>
							<li>
								<strong>Include error messages:</strong> Full stack
								traces help us diagnose issues quickly
							</li>
						</ul>
					</section>
				</div>

				{/* CTA */}
				<div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
					<h3 className="text-2xl font-semibold mb-4">
						Support dj-stripe, Get Supported
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Your sponsorship helps us maintain dj-stripe and provides you
						with the support you need.
					</p>
					<Link
						href="/sponsors"
						className="inline-block px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-lg font-medium"
					>
						Become a Sponsor
					</Link>
				</div>
			</main>
		</div>
	);
}
