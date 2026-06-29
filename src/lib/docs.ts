import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { getApiRefs } from "./markdown";

const DOCS_BASE_PATH = path.join(process.cwd(), "docs-versions");

export async function getVersions(): Promise<string[]> {
	// Newest first. "dev" tracks the main branch and is the default version
	// visitors land on; the numbered entries are stable releases.
	return ["dev", "2.11", "2.10", "2.9", "2.8", "2.7", "2.6", "2.5"];
}

export async function getLatestVersion(): Promise<string> {
	// The latest stable release (what /docs/latest resolves to).
	return "2.11";
}

export async function getDocumentationContent(
	version: string,
	filePath: string,
): Promise<string | null> {
	try {
		const fullPath = path.join(DOCS_BASE_PATH, version, `${filePath}.md`);
		const content = await fs.readFile(fullPath, "utf-8");
		const { content: markdownContent } = matter(content);
		return markdownContent;
	} catch {
		// Return placeholder content for missing pages
		return `# ${filePath.split("/").pop()?.replace(/-/g, " ").replace(/_/g, " ")}

This documentation page will be auto-generated from the dj-stripe repository.

Please check back later or visit the [GitHub repository](https://github.com/dj-stripe/dj-stripe) for the latest documentation.`;
	}
}

interface NavigationItem {
	title: string;
	path: string;
	children?: NavigationItem[];
}

export async function getAllDocumentPaths(version: string): Promise<string[]> {
	const versionPath = path.join(DOCS_BASE_PATH, version);
	const paths: string[] = [];

	async function scanDir(dir: string, prefix = ""): Promise<void> {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				const relativePath = prefix
					? path.join(prefix, entry.name)
					: entry.name;

				if (entry.isDirectory()) {
					await scanDir(fullPath, relativePath);
				} else if (entry.name.endsWith(".md")) {
					const docPath = relativePath
						.replace(/\.md$/, "")
						.replace(/\\/g, "/");
					// Don't add index as a path, it's represented by empty slug
					if (docPath !== "index") {
						paths.push(docPath);
					}
				}
			}
		} catch (error) {
			// Directory might not exist for this version yet
			console.log(`Warning: Could not scan ${dir}:`, error);
		}
	}

	await scanDir(versionPath);
	return paths;
}

// Changelog markdown lives inside each version's docs tree
// (docs-versions/<version>/changes/*.md), not in a top-level folder. We source
// it from "dev" so the published changelog always includes the newest entries,
// including the unreleased section.
const CHANGELOG_VERSION = "dev";

async function getChangelogDir(): Promise<string> {
	return path.join(DOCS_BASE_PATH, CHANGELOG_VERSION, "changes");
}

export async function getChangelogContent(filePath: string): Promise<string | null> {
	try {
		const changelogDir = await getChangelogDir();
		const fullPath = path.join(changelogDir, `${filePath}.md`);
		const content = await fs.readFile(fullPath, "utf-8");
		const { content: markdownContent } = matter(content);
		return markdownContent;
	} catch {
		// Try to create an index if it doesn't exist
		if (filePath === "index") {
			return `# dj-stripe Changelog

Welcome to the dj-stripe changelog. Here you can find all the changes and improvements made to dj-stripe across all versions.

## Latest Releases

- [Version 3.0 (unreleased)](/changes/3_0_0)
- [Version 2.11](/changes/2_11_0) - Latest stable release
- [Version 2.10](/changes/2_10_0)

## All Versions

Browse the changelog by version in the navigation menu.`;
		}
		return null;
	}
}

export async function getAllChangelogPaths(): Promise<string[]> {
	const changelogPath = await getChangelogDir();
	const paths: string[] = [];

	try {
		const entries = await fs.readdir(changelogPath, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isFile() && entry.name.endsWith(".md")) {
				const docPath = entry.name.replace(/\.md$/, "");
				// Don't add index as a path, it's represented by empty slug
				if (docPath !== "index") {
					paths.push(docPath);
				}
			}
		}
	} catch (error) {
		console.log(`Warning: Could not scan changelog directory:`, error);
	}

	return paths;
}

export async function getNavigation(version?: string): Promise<NavigationItem[]> {
	const nav: NavigationItem[] = [
		{
			title: "Getting Started",
			path: "",
			children: [
				{ title: "Installation", path: "/installation" },
				{ title: "Managing API keys", path: "/api_keys" },
				{ title: "API versions", path: "/api_versions" },
				{ title: "Settings", path: "/settings" },
				{ title: "Upgrading dj-stripe", path: "/upgrade_dj_stripe" },
			],
		},
		{
			title: "Usage",
			path: "/usage",
			children: [
				{ title: "Webhooks", path: "/usage/webhooks" },
				{
					title: "Local webhook testing",
					path: "/usage/local_webhook_testing",
				},
				{ title: "Working with customers", path: "/usage/customers" },
				{
					title: "Subscribing customers",
					path: "/usage/subscribing_customers",
				},
				{
					title: "Adding a payment method",
					path: "/usage/add_payment_method_to_customer",
				},
				{
					title: "Creating charges",
					path: "/usage/creating_individual_charges",
				},
				{
					title: "Managing subscriptions",
					path: "/usage/managing_subscriptions",
				},
				{ title: "Stripe Checkout", path: "/usage/using_stripe_checkout" },
				{ title: "Stripe Elements (JS)", path: "/stripe_elements_js" },
				{
					title: "Manual syncing",
					path: "/usage/manually_syncing_with_stripe",
				},
				{
					title: "Management commands",
					path: "/usage/management_commands",
				},
				{ title: "Using with Docker", path: "/usage/using_with_docker" },
			],
		},
		{
			title: "Project",
			path: "/project",
			children: [
				{ title: "Release process", path: "/project/release_process" },
				{ title: "Support", path: "/project/support" },
				{ title: "Test fixtures", path: "/project/test_fixtures" },
			],
		},
	];

	// Only link to prose docs that actually exist for this version. Newer docs
	// land on `dev` first and are absent from older stable versions, so an
	// unfiltered nav would point at 404s. getAllDocumentPaths returns paths
	// without a leading slash or `.md` extension (e.g. "usage/customers").
	const available = version ? new Set(await getAllDocumentPaths(version)) : null;
	const filtered =
		available && available.size > 0
			? nav
					.map((section) => ({
						...section,
						children: section.children?.filter((child) =>
							available.has(child.path.replace(/^\//, "")),
						),
					}))
					.filter(
						(section) => section.children && section.children.length > 0,
					)
			: nav;

	// Append the auto-generated API reference section. Module pages are the refs
	// whose URL has no anchor; the renderer re-adds the `/docs/<version>` prefix.
	if (version) {
		const refs = getApiRefs(version);
		const referenceChildren: NavigationItem[] = Object.entries(refs)
			.filter(([, url]) => !url.includes("#"))
			.map(([dotted, url]) => ({
				title: dotted.replace(/^djstripe\./, ""),
				path: url.replace(`/docs/${version}`, ""),
			}));
		if (referenceChildren.length) {
			filtered.push({
				title: "API Reference",
				path: "/reference",
				children: referenceChildren,
			});
		}
	}

	return filtered;
}
