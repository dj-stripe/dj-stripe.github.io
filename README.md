# dj-stripe.dev

This is the codebase that hosts [dj-stripe.dev](https://dj-stripe.dev/) and contains custom "overrides" for the [mkdocs-material](https://github.com/squidfunk/mkdocs-material) theme

## Deployment Process
The Github action that build and deploys the site is locaded in [dj-stripe](https://github.com/dj-stripe/dj-stripe) repo in the [docs](https://github.com/dj-stripe/dj-stripe/blob/b2dff48f2c3bbef445c6ff3d99f44df6a7576ff6/.github/workflows/docs.yml) action.

## Development

These are the steps to get up and running locally.

Install poetry:

```
curl -sSL https://install.python-poetry.org | python3.11 -
```

Clone dj-stripe and this repos side by side

```
git clone https://github.com/dj-stripe/dj-stripe.git
git clone https://github.com/dj-stripe/dj-stripe.github.io.git
```

This should leave you with a file structure:
```
/your-directory/
    ├── dj-stripe/
    └── dj-stripe.github.io/
```

`cd` into `dj-stripe.github.io`
```
cd dj-stripe.github.io
```


Initialize the `pyproject.toml` and other files from `dj-stripe`:

```
cp -r ../dj-stripe/pyproject.toml ../dj-stripe/mkdocs.yml ../dj-stripe/docs ../dj-stripe/tests .
sed -i 's|name = "dj-stripe"|name = "dj-stripe-docs"|' pyproject.toml
sed -i 's|include = "djstripe"|include = "../dj-stripe/djstripe"|' pyproject.toml
```

Add dj-stripe local dependency:

```
poetry add ../dj-stripe
```

Install the dependencies:

```
poetry install --with docs
```

Build the docs:

```
poetry run mike deploy dev
```

Serve the docs:

```
cd site
python3 -m http.server
```
