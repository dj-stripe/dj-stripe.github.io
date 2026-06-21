import { Footer } from "@/components/footer";
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
		<div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
			<Navigation className="sticky top-0 bg-white dark:bg-gray-900 z-10">
				<VersionSelector
					currentVersion={version}
					versions={versions}
					currentPath={filePath}
				/>
			</Navigation>

			<div className="container mx-auto flex-1 px-6 py-8">
				<div className="flex gap-8">
					<aside className="hidden lg:block w-64 flex-shrink-0">
						<nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-8">
							<p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Documentation
							</p>
							<ul className="space-y-6">
								{navigation.map((item) => {
									const isActive = (path: string) =>
										path === `/${filePath}`
										|| (path === "" && filePath === "index");
									return (
										<li key={item.path}>
											<Link
												href={`/docs/${version}${item.path}`}
												className={`block text-sm font-semibold transition-colors ${
													isActive(item.path)
														? "text-blue-600 dark:text-blue-400"
														: "text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
												}`}
											>
												{item.title}
											</Link>
											{item.children && (
												<ul className="mt-2 space-y-px border-l border-gray-200 dark:border-gray-800">
													{item.children.map((child) => (
														<li key={child.path}>
															<Link
																href={`/docs/${version}${child.path}`}
																className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
																	isActive(
																		child.path,
																	)
																		? "border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
																		: "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100"
																}`}
															>
																{child.title}
															</Link>
														</li>
													))}
												</ul>
											)}
										</li>
									);
								})}
							</ul>
						</nav>
					</aside>

					<main className="min-w-0 flex-1 max-w-3xl">
						<article className="prose max-w-none">
							<MDXRemote
								source={content}
								options={{
									parseFrontmatter: true,
									mdxOptions: {
										// Docs are plain Markdown (MkDocs/CommonMark),
										// not MDX. Parsing as "md" avoids treating
										// `{...}` in code blocks as JSX expressions.
										format: "md",
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

			<Footer />
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
