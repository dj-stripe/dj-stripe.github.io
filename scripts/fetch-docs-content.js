const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const DOCS_BASE_PATH = path.join(process.cwd(), "docs-versions");
const MAIN_REPO = "dj-stripe/dj-stripe";

// Hardcoded supported versions
const SUPPORTED_VERSIONS = ["2.10", "2.9", "2.8", "2.7", "2.6", "2.5"];

async function ensureDir(dir) {
	try {
		await fs.mkdir(dir, { recursive: true });
	} catch {
		// Directory already exists
	}
}

async function fixMDXIssues(dirPath) {
	// Fix MDX compatibility issues in markdown files fetched from MkDocs branches
	console.log(`Fixing MDX issues in ${dirPath}...`);

	try {
		// Replace MkDocs admonitions with plain markdown
		await execAsync(
			`find "${dirPath}" -name "*.md" -exec sed -i 's/^!!! note/**Note:**/g; s/^!!! tip/**Tip:**/g; s/^!!! warning/**Warning:**/g; s/^!!! attention/**Attention:**/g; s/^!!! danger/**Danger:**/g; s/^!!! info/**Info:**/g' {} \\;`,
		);

		// Remove 4-space indentation that follows admonition markers
		await execAsync(
			`find "${dirPath}" -name "*.md" -exec perl -i -pe 's/^    (.+)/$1/ if \\$prev =~ \\/^\\*\\*(Note|Tip|Warning|Attention|Danger|Info):\\*\\*\\/; \\$prev = \\$_' {} \\;`,
		);

		// Remove angle brackets from URLs
		await execAsync(
			`find "${dirPath}" -name "*.md" -exec sed -i 's/<\\(https\\?:\\/\\/[^>]*\\)>/\\1/g' {} \\;`,
		);

		// Fix angle brackets in code examples (e.g., "<your secret key>")
		await execAsync(
			`find "${dirPath}" -name "*.md" -exec sed -i 's/"<your secret key>"/"\\\&lt;your secret key\\\&gt;"/g' {} \\;`,
		);

		console.log(`✓ Fixed MDX issues in ${dirPath}`);
	} catch (error) {
		console.warn(
			`Warning: Could not fix all MDX issues in ${dirPath}:`,
			error.message,
		);
	}
}

async function fetchZipArchive(owner, repo, branch) {
	const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

	console.log(`Fetching zip archive from: ${url} (branch: ${branch})`);

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

async function checkBranchExists(owner, repo, branch) {
	const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;

	try {
		const response = await fetch(url, {
			headers: {
				Accept: "application/vnd.github.v3+json",
				"User-Agent": "dj-stripe-docs-builder",
				...(process.env.GITHUB_TOKEN && {
					Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				}),
			},
		});

		return response.ok;
	} catch {
		return false;
	}
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
		console.log("\n=== Fetching dev docs from main branch ===");
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

		// Note: main branch already has MDX-compatible docs, no fixes needed

		// Clean up main repo files
		await fs.unlink(mainZipPath);
		await fs.rm(mainExtractPath, { recursive: true, force: true });

		// Fetch versioned docs from stable branches
		console.log("\n=== Fetching versioned docs from stable branches ===");

		for (const version of SUPPORTED_VERSIONS) {
			const branchName = `stable/${version}`;
			console.log(`\nChecking for branch: ${branchName}`);

			// Check if the stable branch exists
			const branchExists = await checkBranchExists(
				mainOwner,
				mainRepoName,
				branchName,
			);

			if (branchExists) {
				console.log(`Fetching docs from ${branchName}...`);

				try {
					// Fetch the stable branch
					const versionZipBuffer = await fetchZipArchive(
						mainOwner,
						mainRepoName,
						branchName,
					);

					// Save and extract version zip
					const versionZipPath = path.join(tempDir, `${version}-repo.zip`);
					await fs.writeFile(versionZipPath, versionZipBuffer);

					const versionExtractPath = path.join(tempDir, `${version}-extract`);
					await extractZip(versionZipPath, versionExtractPath);

					// Move docs to version folder
					const versionPath = path.join(DOCS_BASE_PATH, version);
					await moveExtractedContent(versionExtractPath, versionPath, "docs");

					// Fix MDX issues for stable branches (they use MkDocs)
					await fixMDXIssues(versionPath);

					// Clean up version files
					await fs.unlink(versionZipPath);
					await fs.rm(versionExtractPath, { recursive: true, force: true });

					console.log(`✓ Successfully fetched docs for version ${version}`);
				} catch (error) {
					console.error(
						`✗ Failed to fetch docs for version ${version}:`,
						error.message,
					);
				}
			} else {
				console.log(`✗ Branch ${branchName} does not exist, skipping...`);
			}
		}

		// Clean up temp directory
		await fs.rm(tempDir, { recursive: true, force: true });

		console.log("\n=== Documentation content fetched successfully! ===");

		// List what was fetched
		const fetchedVersions = await fs.readdir(DOCS_BASE_PATH);
		console.log(
			"\nFetched documentation for versions:",
			fetchedVersions.join(", "),
		);
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
