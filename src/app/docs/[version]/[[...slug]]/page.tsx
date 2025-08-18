import { Navigation } from "@/components/navigation";
import { VersionSelector } from "@/components/version-selector";
import {
	getDocumentationContent,
	getLatestVersion,
	getNavigation,
	getVersions,
	getAllDocumentPaths,
} from "@/lib/docs";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface PageProps {
	params: Promise<{
		version: string;
		slug?: string[];
	}>;
}

export default async function DocumentationPage({ params }: PageProps) {
	const { version, slug } = await params;

	// Handle "latest" redirect
	if (version === "latest") {
		const latestVersion = await getLatestVersion();
		const redirectPath = slug
			? `/docs/${latestVersion}/${slug.join("/")}`
			: `/docs/${latestVersion}`;
		redirect(redirectPath);
	}

	const versions = await getVersions();

	if (!versions.includes(version)) {
		notFound();
	}

	const filePath = slug ? slug.join("/") : "index";
	const content = await getDocumentationContent(version, filePath);

	if (!content) {
		notFound();
	}

	const navigation = await getNavigation();

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation className="sticky top-0 bg-white dark:bg-gray-900 z-10">
				<VersionSelector
					currentVersion={version}
					versions={versions}
					currentPath={filePath}
				/>
			</Navigation>

			<div className="container mx-auto px-6 py-8">
				<div className="flex gap-8">
					<aside className="w-64 flex-shrink-0">
						<nav className="sticky top-24">
							<h3 className="font-semibold mb-4">Documentation</h3>
							<ul className="space-y-2">
								{navigation.map((item) => (
									<li key={item.path}>
										<Link
											href={`/docs/${version}${item.path}`}
											className={`block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
												item.path === `/${filePath}`
												|| (item.path === ""
													&& filePath === "index")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
													: ""
											}`}
										>
											{item.title}
										</Link>
										{item.children && (
											<ul className="ml-4 mt-2 space-y-1">
												{item.children.map((child) => (
													<li key={child.path}>
														<Link
															href={`/docs/${version}${child.path}`}
															className={`block px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
																child.path
																=== `/${filePath}`
																	? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
																	: "text-gray-600 dark:text-gray-400"
															}`}
														>
															{child.title}
														</Link>
													</li>
												))}
											</ul>
										)}
									</li>
								))}
							</ul>
						</nav>
					</aside>

					<main className="flex-1 max-w-4xl">
						<article className="prose prose-lg max-w-none">
							<MDXRemote
								source={content}
								options={{
									parseFrontmatter: true,
									mdxOptions: {
										remarkPlugins: [remarkGfm],
										rehypePlugins: [rehypeHighlight],
									},
								}}
								components={{
									div: ({ class: className, ...props }) => (
										<div className={className} {...props} />
									),
								}}
							/>
						</article>
					</main>
				</div>
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const versions = await getVersions();
	// Add "latest" to versions for static generation
	const allVersions = [...versions, "latest"];
	const params: Array<{ version: string; slug?: string[] }> = [];

	for (const version of allVersions) {
		// Add index page (no slug)
		params.push({ version, slug: undefined });

		// For "latest", use the actual latest version for path discovery
		const versionToScan = version === "latest" ? await getLatestVersion() : version;

		// Get all document paths from the file system
		const allPaths = await getAllDocumentPaths(versionToScan);

		// Add all discovered paths
		for (const docPath of allPaths) {
			params.push({
				version,
				slug: docPath.split("/"),
			});
		}
	}

	return params;
}

export const dynamicParams = false;
