import fs from "fs";
import path from "path";
import type { Root, Heading, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// Map of { version: { dotted.path: "/docs/<version>/reference/..." } }, produced
// by scripts/generate_api_reference.py during the docs fetch step.
type ApiRefs = Record<string, Record<string, string>>;

let cachedRefs: ApiRefs | null = null;

function loadApiRefs(): ApiRefs {
	if (cachedRefs) return cachedRefs;
	const refsPath = path.join(process.cwd(), "src", "lib", "api-refs.json");
	try {
		cachedRefs = JSON.parse(fs.readFileSync(refsPath, "utf-8"));
	} catch {
		cachedRefs = {};
	}
	return cachedRefs!;
}

export function getApiRefs(version: string): Record<string, string> {
	return loadApiRefs()[version] ?? {};
}

/**
 * Resolve mkdocstrings-style shortcut references like
 * `` [`Customer.charge`][djstripe.models.core.Customer.charge] ``.
 *
 * Rather than rewrite the AST, we append a standard Markdown link definition
 * (`[label]: url`) for every reference label in the document that resolves to a
 * generated API reference page. CommonMark then links them like any other
 * reference link (label matching is case-insensitive). Unresolved labels are
 * left untouched and render as their visible text.
 */
export function injectApiRefDefinitions(
	content: string,
	refs: Record<string, string>,
): string {
	if (!Object.keys(refs).length) return content;

	// Case-insensitive lookup, mirroring CommonMark label normalisation.
	const lower = new Map<string, string>();
	for (const [key, url] of Object.entries(refs)) {
		lower.set(key.toLowerCase().replace(/\s+/g, " ").trim(), url);
	}

	const labels = new Set<string>();
	// Full references: [text][label]
	for (const m of content.matchAll(/\]\[\s*([^\]\r\n]+?)\s*\]/g)) {
		if (m[1]) labels.add(m[1]);
	}
	// Collapsed references: [label][]
	for (const m of content.matchAll(/\[\s*([^\]\r\n]+?)\s*\]\[\s*\]/g)) {
		if (m[1]) labels.add(m[1]);
	}

	const definitions: string[] = [];
	const seen = new Set<string>();
	for (const label of labels) {
		const key = label.toLowerCase().replace(/\s+/g, " ").trim();
		const url = lower.get(key);
		if (url && !seen.has(key)) {
			seen.add(key);
			definitions.push(`[${label}]: ${url}`);
		}
	}

	if (!definitions.length) return content;
	return `${content}\n\n${definitions.join("\n")}\n`;
}

/**
 * Support explicit heading anchors written as `## Title {#custom-id}`.
 *
 * The API reference generator emits these so that cross-references can target a
 * member by its dotted path (e.g. `#djstripe.models.core.Customer.charge`). The
 * trailing `{#id}` is stripped from the visible text and applied as the heading
 * element's `id`.
 */
export const remarkHeadingId: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, "heading", (node: Heading) => {
			const last = node.children[node.children.length - 1];
			if (!last || last.type !== "text") return;
			const text = last as Text;
			const match = text.value.match(/\s*\{#([^}]+)\}\s*$/);
			if (!match) return;
			text.value = text.value.slice(0, match.index).trimEnd();
			const data = (node.data ??= {});
			const props = ((
				data as { hProperties?: Record<string, unknown> }
			).hProperties ??= {});
			props.id = match[1];
		});
	};
};
