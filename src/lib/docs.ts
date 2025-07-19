import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

const DOCS_BASE_PATH = path.join(process.cwd(), "docs-versions");

export async function getVersions(): Promise<string[]> {
	// Hardcoded supported versions for now
	// Note: 2.10 branch doesn't exist yet, will add when available
	return ["2.9", "2.8", "2.7", "2.6", "2.5", "dev"];
}

export async function getLatestVersion(): Promise<string> {
	// Return the latest stable version
	return "2.9";
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

export async function getChangelogContent(filePath: string): Promise<string | null> {
	try {
		const fullPath = path.join(DOCS_BASE_PATH, "changes", `${filePath}.md`);
		const content = await fs.readFile(fullPath, "utf-8");
		const { content: markdownContent } = matter(content);
		return markdownContent;
	} catch {
		// Try to create an index if it doesn't exist
		if (filePath === "index") {
			return `# dj-stripe Changelog

Welcome to the dj-stripe changelog. Here you can find all the changes and improvements made to dj-stripe across all versions.

## Latest Releases

- [Version 2.10](/changes/2_10_0) - Latest stable release
- [Version 2.9](/changes/2_9_0)
- [Version 2.8](/changes/2_8_0)

## All Versions

Browse the changelog by version in the navigation menu.`;
		}
		return null;
	}
}

export async function getAllChangelogPaths(): Promise<string[]> {
	const changelogPath = path.join(DOCS_BASE_PATH, "changes");
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

export async function getNavigation(): Promise<NavigationItem[]> {
	// This is a placeholder navigation structure
	// In a real implementation, you might want to generate this from the file structure
	// or from a navigation configuration file
	return [
		{
			title: "Getting Started",
			path: "",
			children: [
				{ title: "Installation", path: "/installation" },
				{ title: "API Keys", path: "/api_keys" },
				{ title: "API Versions", path: "/api_versions" },
				{ title: "Upgrade Guide", path: "/upgrade_dj_stripe" },
			],
		},
		{
			title: "Usage",
			path: "/usage",
			children: [
				{ title: "Webhooks", path: "/usage/webhooks" },
				{
					title: "Subscribing Customers",
					path: "/usage/subscribing_customers",
				},
				{
					title: "Payment Methods",
					path: "/usage/add_payment_method_to_customer",
				},
				{
					title: "Managing Subscriptions",
					path: "/usage/managing_subscriptions",
				},
				{ title: "Stripe Checkout", path: "/usage/using_stripe_checkout" },
				{
					title: "Manual Syncing",
					path: "/usage/manually_syncing_with_stripe",
				},
			],
		},
	];
}
