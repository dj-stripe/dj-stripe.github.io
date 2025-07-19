import { Navigation } from "@/components/navigation";
import { getChangelogContent, getAllChangelogPaths } from "@/lib/docs";
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

	const changelogNavigation = [
		{ title: "Overview", path: "" },
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
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Navigation className="sticky top-0 bg-white dark:bg-gray-900 z-10" />

			<div className="container mx-auto px-6 py-8">
				<div className="flex gap-8">
					<aside className="w-64 flex-shrink-0">
						<nav className="sticky top-24">
							<h3 className="font-semibold mb-4">Changelog</h3>
							<ul className="space-y-2">
								{changelogNavigation.map((item) => (
									<li key={item.path}>
										<Link
											href={`/changes${item.path}`}
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
