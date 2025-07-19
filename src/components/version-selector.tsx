"use client";

interface VersionSelectorProps {
	currentVersion: string;
	versions: string[];
	currentPath: string;
}

export function VersionSelector({
	currentVersion,
	versions,
	currentPath,
}: VersionSelectorProps) {
	return (
		<select
			value={currentVersion}
			onChange={(e) => {
				const newVersion = e.target.value;
				const newPath = currentPath === "index" ? "" : `/${currentPath}`;
				window.location.href = `/docs/${newVersion}${newPath}`;
			}}
			className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
		>
			{versions.map((v) => (
				<option key={v} value={v}>
					{v === "latest" ? "Latest Stable" : `v${v}`}
				</option>
			))}
		</select>
	);
}
