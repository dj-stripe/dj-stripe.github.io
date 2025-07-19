const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const DOCS_BASE_PATH = path.join(process.cwd(), "docs-versions");
const CONTENT_REPO = "dj-stripe/docs-content";
const MAIN_REPO = "dj-stripe/dj-stripe";

async function ensureDir(dir) {
	try {
		await fs.mkdir(dir, { recursive: true });
	} catch {
		// Directory already exists
	}
}

async function fetchZipArchive(owner, repo, branch) {
	const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

	console.log(`Fetching zip archive from: ${url}`);

	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "dj-stripe-docs-builder",
			...(process.env.GITHUB_TOKEN && {
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			}),
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch zip from GitHub: ${response.status} ${response.statusText}`,
		);
	}

	const buffer = await response.arrayBuffer();
	return Buffer.from(buffer);
}

async function extractZip(zipPath, extractPath) {
	await ensureDir(extractPath);
	console.log(`Extracting ${zipPath} to ${extractPath}...`);

	try {
		await execAsync(`unzip -q -o "${zipPath}" -d "${extractPath}"`);
		console.log("Extraction complete");
	} catch (error) {
		console.error("Failed to extract zip:", error);
		throw error;
	}
}

async function moveExtractedContent(extractPath, targetPath, subPath = "") {
	await ensureDir(targetPath);

	// Find the extracted directory (GitHub adds a prefix)
	const items = await fs.readdir(extractPath);
	const extractedDir = items.find((item) => item.includes("-"));

	if (!extractedDir) {
		throw new Error("Could not find extracted directory");
	}

	const sourcePath = path.join(extractPath, extractedDir, subPath);

	try {
		// Check if source path exists
		await fs.access(sourcePath);

		// Move all markdown files from source to target, preserving directory structure
		await execAsync(
			`find "${sourcePath}" -name "*.md" -type f -exec bash -c 'mkdir -p "${targetPath}/$(dirname "{}" | sed "s|${sourcePath}/||")" && cp "{}" "${targetPath}/$(echo "{}" | sed "s|${sourcePath}/||")"' \\;`,
		);

		console.log(`Moved markdown files from ${sourcePath} to ${targetPath}`);
	} catch (error) {
		console.log(`Source path ${sourcePath} does not exist, skipping...`);
	}
}

async function fetchVersionsMetadata(owner, repo) {
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/?ref=main`;

	console.log(`Fetching repository root contents from: ${url}`);

	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "dj-stripe-docs-builder",
			...(process.env.GITHUB_TOKEN && {
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			}),
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch from GitHub: ${response.status} ${response.statusText}`,
		);
	}

	const items = await response.json();

	// Find version directories and metadata files
	const versionDirs = items
		.filter((item) => item.type === "dir" && /^\d+\.\d+$/.test(item.name))
		.map((item) => item.name);

	const metadataFiles = {};

	// Check for LATEST file
	const latestFile = items.find((item) => item.name === "LATEST");
	if (latestFile) {
		const response = await fetch(latestFile.download_url);
		if (response.ok) {
			metadataFiles.LATEST = await response.text();
		}
	}

	// Check for versions.json
	const versionsFile = items.find((item) => item.name === "versions.json");
	if (versionsFile) {
		const response = await fetch(versionsFile.download_url);
		if (response.ok) {
			metadataFiles["versions.json"] = await response.text();
		}
	}

	return { versionDirs, metadataFiles };
}

async function fetchDocsContent() {
	console.log("Fetching documentation content from GitHub...");

	// Ensure base directory exists
	await ensureDir(DOCS_BASE_PATH);

	// Create temp directory for zip extraction
	const tempDir = path.join(process.cwd(), ".temp-docs-fetch");
	await ensureDir(tempDir);

	try {
		// Fetch dev docs from main repository
		console.log("\nFetching dev docs from main repository as zip...");
		const [mainOwner, mainRepoName] = MAIN_REPO.split("/");
		const mainZipBuffer = await fetchZipArchive(mainOwner, mainRepoName, "main");

		// Save and extract main repo zip
		const mainZipPath = path.join(tempDir, "main-repo.zip");
		await fs.writeFile(mainZipPath, mainZipBuffer);

		const mainExtractPath = path.join(tempDir, "main-extract");
		await extractZip(mainZipPath, mainExtractPath);

		// Move docs from main repo to dev folder
		const devPath = path.join(DOCS_BASE_PATH, "dev");
		await moveExtractedContent(mainExtractPath, devPath, "docs");

		// Clean up main repo files
		await fs.unlink(mainZipPath);
		await fs.rm(mainExtractPath, { recursive: true, force: true });

		// Fetch versioned docs from docs-content repository
		console.log("\nFetching versioned docs from docs-content repository as zip...");
		const [contentOwner, contentRepoName] = CONTENT_REPO.split("/");

		// First get metadata about versions
		const { versionDirs, metadataFiles } = await fetchVersionsMetadata(
			contentOwner,
			contentRepoName,
		);

		// Save metadata files
		for (const [filename, content] of Object.entries(metadataFiles)) {
			await fs.writeFile(path.join(DOCS_BASE_PATH, filename), content);
			console.log(`Saved metadata file: ${filename}`);
		}

		// Fetch the entire docs-content repo as zip
		const contentZipBuffer = await fetchZipArchive(
			contentOwner,
			contentRepoName,
			"main",
		);

		// Save and extract content repo zip
		const contentZipPath = path.join(tempDir, "content-repo.zip");
		await fs.writeFile(contentZipPath, contentZipBuffer);

		const contentExtractPath = path.join(tempDir, "content-extract");
		await extractZip(contentZipPath, contentExtractPath);

		// Move each version directory
		for (const versionDir of versionDirs) {
			console.log(`\nProcessing version ${versionDir}...`);
			const versionPath = path.join(DOCS_BASE_PATH, versionDir);
			await moveExtractedContent(contentExtractPath, versionPath, versionDir);
		}

		// Clean up content repo files
		await fs.unlink(contentZipPath);
		await fs.rm(contentExtractPath, { recursive: true, force: true });

		// Clean up temp directory
		await fs.rm(tempDir, { recursive: true, force: true });

		console.log("\nDocumentation content fetched successfully!");
	} catch (error) {
		console.error("Error fetching documentation:", error);

		// Clean up on error
		try {
			await fs.rm(tempDir, { recursive: true, force: true });
		} catch {}

		throw error;
	}
}

// Run the script
if (require.main === module) {
	fetchDocsContent().catch((error) => {
		console.error("Failed to fetch documentation content:", error);
		process.exit(1);
	});
}

module.exports = { fetchDocsContent };
