"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SearchRecord {
	title: string;
	path: string;
	section: string;
	excerpt: string;
	headings: string[];
	text: string;
}

interface ScoredRecord extends SearchRecord {
	score: number;
}

const SECTION_ORDER = ["Documentation", "Changelog", "Pages"];
const MAX_RESULTS = 24;

function scoreRecord(record: SearchRecord, terms: string[]): number {
	const title = record.title.toLowerCase();
	const headings = record.headings.join(" \n ").toLowerCase();
	let score = 0;

	for (const term of terms) {
		let termScore = 0;
		if (title === term) termScore += 100;
		else if (title.startsWith(term)) termScore += 60;
		else if (title.includes(term)) termScore += 40;

		if (headings.includes(term)) termScore += 12;
		if (record.text.includes(term)) termScore += 5;

		// Every term must match somewhere, otherwise this record is out.
		if (termScore === 0) return 0;
		score += termScore;
	}

	return score;
}

export function Search() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [records, setRecords] = useState<SearchRecord[]>([]);
	const [loaded, setLoaded] = useState(false);
	const loadStarted = useRef(false);

	const loadIndex = useCallback(async () => {
		if (loadStarted.current) return;
		loadStarted.current = true;
		try {
			const res = await fetch("/search-index.json");
			if (!res.ok) throw new Error(`Search index error: ${res.status}`);
			const data = (await res.json()) as SearchRecord[];
			setRecords(data);
		} catch {
			setRecords([]);
		} finally {
			setLoaded(true);
		}
	}, []);

	// Cmd/Ctrl+K toggles the palette from anywhere.
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((prev) => !prev);
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		if (open) loadIndex();
	}, [open, loadIndex]);

	const grouped = useMemo(() => {
		const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return [];

		const scored: ScoredRecord[] = [];
		for (const record of records) {
			const score = scoreRecord(record, terms);
			if (score > 0) scored.push({ ...record, score });
		}
		scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

		const top = scored.slice(0, MAX_RESULTS);
		const bySection = new Map<string, ScoredRecord[]>();
		for (const record of top) {
			const list = bySection.get(record.section) ?? [];
			list.push(record);
			bySection.set(record.section, list);
		}

		return SECTION_ORDER.filter((section) => bySection.has(section)).map(
			(section) => ({ section, items: bySection.get(section)! }),
		);
	}, [query, records]);

	const go = useCallback(
		(path: string) => {
			setOpen(false);
			setQuery("");
			router.push(path);
		},
		[router],
	);

	const openPalette = () => setOpen(true);

	return (
		<>
			<button
				onClick={openPalette}
				className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
				aria-label="Search documentation"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<span>Search</span>
				<kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
					⌘K
				</kbd>
			</button>

			<Command.Dialog
				open={open}
				onOpenChange={setOpen}
				label="Search documentation"
				shouldFilter={false}
				loop
				className="fixed left-1/2 top-[12vh] z-[100] w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
				overlayClassName="fixed inset-0 z-[99] bg-gray-900/40 backdrop-blur-sm dark:bg-black/60"
			>
				<div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
					<svg
						className="h-5 w-5 flex-shrink-0 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<Command.Input
						value={query}
						onValueChange={setQuery}
						placeholder="Search documentation, changelog, pages…"
						className="flex-1 bg-transparent py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
					/>
					<kbd className="hidden flex-shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-700 sm:inline-block">
						ESC
					</kbd>
				</div>

				<Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
					{!query.trim() ? (
						<div className="px-3 py-10 text-center text-sm text-gray-400">
							{loaded
								? "Type to search the docs, changelog, and site."
								: "Loading search index…"}
						</div>
					) : (
						<>
							<Command.Empty className="px-3 py-10 text-center text-sm text-gray-400">
								No results for &ldquo;{query}&rdquo;
							</Command.Empty>
							{grouped.map(({ section, items }) => (
								<Command.Group
									key={section}
									heading={section}
									className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-gray-400"
								>
									{items.map((item) => (
										<Command.Item
											key={item.path}
											value={item.path}
											onSelect={() => go(item.path)}
											className="flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30"
										>
											<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
												{item.title}
											</span>
											{item.excerpt && (
												<span className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
													{item.excerpt}
												</span>
											)}
										</Command.Item>
									))}
								</Command.Group>
							))}
						</>
					)}
				</Command.List>

				<div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1">
							<kbd className="rounded border border-gray-200 px-1 dark:border-gray-700">
								↑
							</kbd>
							<kbd className="rounded border border-gray-200 px-1 dark:border-gray-700">
								↓
							</kbd>
							to navigate
						</span>
						<span className="flex items-center gap-1">
							<kbd className="rounded border border-gray-200 px-1 dark:border-gray-700">
								↵
							</kbd>
							to open
						</span>
					</div>
					<span>dj-stripe</span>
				</div>
			</Command.Dialog>
		</>
	);
}
