# dj-stripe.dev

This repository hosts the [dj-stripe.dev](https://dj-stripe.dev/) website and documentation for all versions of dj-stripe.

## Architecture

- **Website**: NextJS static site deployed to GitHub Pages
- **Documentation**: Markdown files rendered with NextJS
    - `/docs/dev/` - Latest development docs (auto-synced from main repo)
    - `/docs/2.9/`, `/docs/2.8/` etc - Stable version documentation
    - `/docs/latest` - Redirects to the latest stable version

## Tech Stack

- [NextJS](https://nextjs.org/) with TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Bun](https://bun.sh/) package manager
- Static export for GitHub Pages

## Development

### Prerequisites

Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Local Development

Clone the repository:

```bash
git clone https://github.com/dj-stripe/dj-stripe.github.io.git
cd dj-stripe.github.io
```

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun dev
```

Build for production:

```bash
bun run build
```

## Documentation Structure

```
docs/
├── dev/           # Development docs (synced from main repo)
├── 2.9/           # Stable version 2.9
├── 2.8/           # Stable version 2.8
└── ...            # Other stable versions
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Updating Development Docs

Development documentation (`/docs/dev/`) is automatically updated via GitHub Actions whenever changes are pushed to the main dj-stripe repository.

### Creating a New Stable Version

When releasing a new stable version of dj-stripe:

1. Copy the current dev docs to a new version folder (e.g., `docs/2.10/`)
2. Update the version switcher configuration
3. Update the `/docs/latest` redirect
4. Commit and push changes

## Contributing

Please see the main [dj-stripe repository](https://github.com/dj-stripe/dj-stripe) for contribution guidelines.

## License

This project is licensed under the MIT License - see the main dj-stripe repository for details.
