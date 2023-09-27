# dj-stripe.dev

This is the codebase that builds [dj-stripe.dev](https://dj-stripe.dev/).

## Development

These are the steps to get up and running locally.
They are also defined in `.github/workflows/ci.yml` and used to build the site in production. 

Install poetry:

```
curl -sSL https://install.python-poetry.org | python3.11 -
```

Clone dj-stripe:

```
git clone https://github.com/dj-stripe/dj-stripe.git
```

Initialize the `pyproject.toml` and other files from `dj-stripe`:

```
cp -r dj-stripe/pyproject.toml dj-stripe/mkdocs.yml dj-stripe/docs dj-stripe/tests .
sed -i 's|name = "dj-stripe"|name = "dj-stripe-docs"|' pyproject.toml
sed -i 's|include = "djstripe"|include = "dj-stripe/djstripe"|' pyproject.toml
```

Add dj-stripe local dependency:

```
poetry add ./dj-stripe
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
