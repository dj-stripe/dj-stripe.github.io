import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { getChangelogContent, getAllChangelogPaths } from "@/lib/docs";
import { getApiRefs, injectApiRefDefinitions, remarkHeadingId } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

export default async function ChangelogPage({ params }: PageProps) {
	const { slug } = await params;
	const filePath = slug ? slug.join("/") : "index";
	const content = await getChangelogContent(filePath);

	if (!content) {
		notFound();
	}

	// The changelog is sourced from the "dev" docs tree; resolve API
	// cross-references against that version's generated reference.
	const renderedContent = injectApiRefDefinitions(content, getApiRefs("dev"));

	const changelogNavigation = [
		{ title: "Overview", path: "" },
		{ title: "Version 3.0 (unreleased)", path: "/3_0_0" },
		{ title: "Version 2.11", path: "/2_11_0" },
		{ title: "Version 2.10", path: "/2_10_0" },
		{ title: "Patch Notes 2.10.x", path: "/2_10_x" },
		{ title: "Version 2.9", path: "/2_9_0" },
		{ title: "Version 2.8", path: "/2_8_0" },
		{ title: "Version 2.7", path: "/2_7_0" },
		{ title: "Version 2.6", path: "/2_6_0" },
		{ title: "Version 2.5", path: "/2_5_0" },
		{ title: "Version 2.4", path: "/2_4_0" },
		{ title: "Version 2.x", path: "/2_x" },
		{ title: "Version 1.x", path: "/1_x" },
		{ title: "Version 0.x", path: "/0_x" },
	];

	return (
		<div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
			<Navigation className="sticky top-0 bg-white dark:bg-gray-900 z-10" />

			<div className="container mx-auto flex-1 px-6 py-8">
				<div className="flex gap-8">
					<aside className="hidden lg:block w-64 flex-shrink-0">
						<nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-8">
							<p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Changelog
							</p>
							<ul className="space-y-px border-l border-gray-200 dark:border-gray-800">
								{changelogNavigation.map((item) => {
									const isActive =
										item.path === `/${filePath}`
										|| (item.path === "" && filePath === "index");
									return (
										<li key={item.path}>
											<Link
												href={`/changes${item.path}`}
												className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
													isActive
														? "border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
														: "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100"
												}`}
											>
												{item.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					</aside>

					<main className="min-w-0 flex-1 max-w-3xl">
						<article className="prose max-w-none">
							<MDXRemote
								source={renderedContent}
								options={{
									parseFrontmatter: true,
									mdxOptions: {
										// Changelog is plain Markdown, not MDX.
										// Parsing as "md" avoids treating `{...}`
										// in code blocks as JSX expressions.
										format: "md",
										remarkPlugins: [remarkGfm, remarkHeadingId],
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
	const allPaths = await getAllChangelogPaths();
	const params: Array<{ slug?: string[] }> = [];

	// Add index page (no slug)
	params.push({ slug: undefined });

	// Add all discovered paths
	for (const docPath of allPaths) {
		params.push({
			slug: docPath.split("/"),
		});
	}

	return params;
}

export const dynamicParams = false;
