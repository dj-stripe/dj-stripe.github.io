const fs = require("fs").promises;
const path = require("path");

const ROOT = process.cwd();
const DOCS_BASE_PATH = path.join(ROOT, "docs-versions");
const OUTPUT_PATH = path.join(ROOT, "public", "search-index.json");

// The version whose docs/changelog feed the "latest" routes. Keep in sync
// with getLatestVersion() in src/lib/docs.ts.
const LATEST_VERSION = "2.10";

const MAX_EXCERPT = 160;
const MAX_TEXT = 1200;

function stripFrontmatter(raw) {
	if (raw.startsWith("---")) {
		const end = raw.indexOf("\n---", 3);
		if (end !== -1) {
			return raw.slice(raw.indexOf("\n", end + 1) + 1);
		}
	}
	return raw;
}

function frontmatterTitle(raw) {
	if (!raw.startsWith("---")) return null;
	const end = raw.indexOf("\n---", 3);
	if (end === -1) return null;
	const block = raw.slice(3, end);
	const match = block.match(/^\s*title:\s*(.+)\s*$/m);
	return match ? match[1].replace(/^["']|["']$/g, "").trim() : null;
}

function humanize(slug) {
	return slug
		.split("/")
		.pop()
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Turn markdown into a flat, searchable plain-text blob.
function toPlainText(md) {
	return md
		.replace(/```[\s\S]*?```/g, " ") // fenced code blocks
		.replace(/`[^`]*`/g, " ") // inline code
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
		.replace(/^#{1,6}\s+/gm, "") // heading markers
		.replace(/[*_>#~|-]+/g, " ") // residual markdown punctuation
		.replace(/\s+/g, " ")
		.trim();
}

function firstHeading(md) {
	const match = md.match(/^#{1,6}\s+(.+)$/m);
	return match ? match[1].replace(/[#*`]/g, "").trim() : null;
}

function collectHeadings(md) {
	const headings = [];
	const re = /^#{1,6}\s+(.+)$/gm;
	let m;
	while ((m = re.exec(md)) !== null) {
		headings.push(m[1].replace(/[#*`]/g, "").trim());
	}
	return headings;
}

async function walk(dir) {
	const out = [];
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...(await walk(full)));
		} else if (entry.name.endsWith(".md")) {
			out.push(full);
		}
	}
	return out;
}

function buildRecord({ title, path: pagePath, section, md }) {
	const text = toPlainText(md);
	const headings = collectHeadings(md);
	return {
		title,
		path: pagePath,
		section,
		excerpt: text.slice(0, MAX_EXCERPT).trim(),
		headings: headings.slice(0, 30),
		text: text.slice(0, MAX_TEXT).toLowerCase(),
	};
}

async function buildIndex() {
	const versionDir = path.join(DOCS_BASE_PATH, LATEST_VERSION);
	const files = await walk(versionDir);
	const records = [];

	for (const file of files) {
		const rel = path
			.relative(versionDir, file)
			.replace(/\\/g, "/")
			.replace(/\.md$/, "");

		if (rel.toLowerCase() === "readme") continue;

		const raw = await fs.readFile(file, "utf-8");
		const md = stripFrontmatter(raw);
		const title = frontmatterTitle(raw) || firstHeading(md) || humanize(rel);

		if (rel.startsWith("changes/")) {
			const slug = rel.slice("changes/".length);
			records.push(
				buildRecord({
					title,
					path: `/changes/${slug}`,
					section: "Changelog",
					md,
				}),
			);
		} else if (rel === "index") {
			records.push(
				buildRecord({
					title: "Documentation",
					path: "/docs/latest",
					section: "Documentation",
					md,
				}),
			);
		} else {
			records.push(
				buildRecord({
					title,
					path: `/docs/latest/${rel}`,
					section: "Documentation",
					md,
				}),
			);
		}
	}

	// Top-level site pages that aren't markdown-backed.
	const pages = [
		{
			title: "Home",
			path: "/",
			text: "dj-stripe stripe django payments subscriptions webhooks orm",
		},
		{
			title: "About",
			path: "/about",
			text: "about dj-stripe philosophy local data replication webhook-first django-native",
		},
		{
			title: "Team",
			path: "/team",
			text: "team maintainers core contributors ingram technologies",
		},
		{
			title: "Sponsors",
			path: "/sponsors",
			text: "sponsors sponsorship tiers bronze silver platinum support funding",
		},
		{
			title: "Support",
			path: "/support",
			text: "support help community github issues discussions professional services",
		},
	];
	for (const page of pages) {
		records.push({
			title: page.title,
			path: page.path,
			section: "Pages",
			excerpt: "",
			headings: [],
			text: page.text.toLowerCase(),
		});
	}

	await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
	await fs.writeFile(OUTPUT_PATH, JSON.stringify(records), "utf-8");
	console.log(`✓ Wrote ${records.length} search records to ${OUTPUT_PATH}`);
}

if (require.main === module) {
	buildIndex().catch((error) => {
		console.error("Failed to build search index:", error);
		process.exit(1);
	});
}

module.exports = { buildIndex };
