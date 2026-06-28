#!/usr/bin/env python3
"""Generate Markdown API reference pages for dj-stripe from its source.

This is the clean replacement for the old MkDocs + mkdocstrings setup. It uses
griffe to *statically* analyse the dj-stripe source (no imports, so Django does
not need to be installed) and emits one Markdown page per public module, plus a
JSON "autorefs" map that lets the docs site resolve shortcut references such as
``[`Customer.charge`][djstripe.models.core.Customer.charge]`` to the right page
and anchor.

Usage:
    generate_api_reference.py SOURCE_DIR OUT_DIR VERSION REFS_FILE

    SOURCE_DIR  Directory containing the importable ``djstripe`` package.
    OUT_DIR     Version docs directory (e.g. docs-versions/dev). Pages are written
                under OUT_DIR/reference/.
    VERSION     Docs version slug (e.g. "dev", "2.10"). Used to build URLs.
    REFS_FILE   Path to a JSON file holding { version: { dotted_path: url } }.
                The file is created or updated in place (merging this version).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import griffe

# Top-level modules under ``djstripe`` to document, in nav order. Private modules,
# migrations, locale and templates are intentionally excluded.
MODULES = [
    "djstripe.models.core",
    "djstripe.models.base",
    "djstripe.models.billing",
    "djstripe.models.checkout",
    "djstripe.models.payment_methods",
    "djstripe.models.connect",
    "djstripe.models.account",
    "djstripe.models.api",
    "djstripe.models.webhooks",
    "djstripe.models.entitlements",
    "djstripe.models.identity",
    "djstripe.models.issuing",
    "djstripe.models.radar",
    "djstripe.models.sigma",
    "djstripe.settings",
    "djstripe.fields",
    "djstripe.enums",
    "djstripe.managers",
    "djstripe.signals",
    "djstripe.event_handlers",
    "djstripe.exceptions",
    "djstripe.sync",
    "djstripe.utils",
    "djstripe.management.commands.djstripe_sync_models",
    "djstripe.management.commands.djstripe_process_events",
    "djstripe.management.commands.djstripe_sync_customers",
    "djstripe.management.commands.djstripe_init_customers",
]


def is_public(name: str) -> bool:
    # Exclude private and dunder members. Besides being noise in an API
    # reference, dunder names like ``__str__`` would have their ``{#...}`` anchor
    # mangled by Markdown emphasis parsing of the double underscores.
    return not name.startswith("_")


def format_signature(func: griffe.Function) -> str:
    """Render a compact call signature from a griffe Function."""
    parts: list[str] = []
    for param in func.parameters:
        kind = getattr(param.kind, "value", "")
        if kind == "variadic positional":
            parts.append(f"*{param.name}")
            continue
        if kind == "variadic keyword":
            parts.append(f"**{param.name}")
            continue
        if kind == "keyword-only" and "*" not in parts:
            parts.append("*")
        text = param.name
        if param.annotation is not None:
            text += f": {param.annotation}"
        if param.default is not None:
            text += f" = {param.default}"
        parts.append(text)
    sig = f"({', '.join(parts)})"
    if func.returns is not None:
        sig += f" -> {func.returns}"
    return sig


def anchor(path: str) -> str:
    """Heading-id directive consumed by the remark-heading-id plugin."""
    return f" {{#{path}}}"


def render_docstring(obj: griffe.Object) -> str:
    if obj.docstring is None:
        return ""
    return obj.docstring.value.strip()


def render_function(func: griffe.Function, level: int) -> list[str]:
    out = [f"{'#' * level} `{func.name}`{anchor(func.path)}", ""]
    out.append(f"```python\n{func.name}{format_signature(func)}\n```")
    out.append("")
    doc = render_docstring(func)
    if doc:
        out.extend([doc, ""])
    return out


def render_attribute(attr: griffe.Attribute, level: int) -> list[str]:
    label = "property" if "property" in attr.labels else "attribute"
    out = [f"{'#' * level} `{attr.name}`{anchor(attr.path)}", ""]
    annotation = f": {attr.annotation}" if attr.annotation is not None else ""
    out.append(f"*{label}*&nbsp;&nbsp;`{attr.name}{annotation}`")
    out.append("")
    doc = render_docstring(attr)
    if doc:
        out.extend([doc, ""])
    return out


def render_class(cls: griffe.Class, level: int) -> list[str]:
    out = [f"{'#' * level} `{cls.name}`{anchor(cls.path)}", ""]
    if cls.bases:
        bases = ", ".join(str(b) for b in cls.bases)
        out.append(f"*Bases: {bases}*")
        out.append("")
    doc = render_docstring(cls)
    if doc:
        out.extend([doc, ""])

    members = [
        m
        for name, m in cls.members.items()
        if is_public(name) and not m.is_alias and not getattr(m, "inherited", False)
    ]
    funcs = [m for m in members if m.kind is griffe.Kind.FUNCTION]
    attrs = [m for m in members if m.kind is griffe.Kind.ATTRIBUTE]
    for attr in sorted(attrs, key=lambda m: m.name):
        out.extend(render_attribute(attr, level + 1))
    for func in sorted(funcs, key=lambda m: m.name):
        out.extend(render_function(func, level + 1))
    return out


def render_module(mod: griffe.Module, refs: dict[str, str], url_base: str) -> str:
    title = mod.path
    lines = [f"# `{title}`{anchor(mod.path)}", ""]
    refs[mod.path] = url_base
    doc = render_docstring(mod)
    if doc:
        lines.extend([doc, ""])

    members = [
        m
        for name, m in mod.members.items()
        if is_public(name) and not m.is_alias
    ]
    classes = [m for m in members if m.kind is griffe.Kind.CLASS]
    funcs = [m for m in members if m.kind is griffe.Kind.FUNCTION]

    for cls in sorted(classes, key=lambda m: m.name):
        refs[cls.path] = f"{url_base}#{cls.path}"
        for sub_name, sub in cls.members.items():
            if is_public(sub_name) and not sub.is_alias and not getattr(
                sub, "inherited", False
            ):
                refs[sub.path] = f"{url_base}#{sub.path}"
        lines.extend(render_class(cls, 2))
    for func in sorted(funcs, key=lambda m: m.name):
        refs[func.path] = f"{url_base}#{func.path}"
        lines.extend(render_function(func, 2))

    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    if len(sys.argv) != 5:
        print(__doc__)
        return 2
    source_dir, out_dir, version, refs_file = sys.argv[1:5]

    loader = griffe.GriffeLoader(
        search_paths=[source_dir],
        docstring_parser=griffe.Parser.sphinx,
    )
    djstripe = loader.load("djstripe")  # noqa: F841 (loads submodules lazily)

    reference_dir = Path(out_dir) / "reference"
    reference_dir.mkdir(parents=True, exist_ok=True)

    version_refs: dict[str, str] = {}
    generated: list[str] = []

    for dotted in MODULES:
        try:
            mod = loader.modules_collection[dotted]
        except KeyError:
            print(f"  ! skipping {dotted} (not found)")
            continue
        rel = dotted.replace(".", "/")
        url_base = f"/docs/{version}/reference/{rel}"
        page = render_module(mod, version_refs, url_base)
        out_path = reference_dir / f"{rel}.md"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(page, encoding="utf-8")
        generated.append(dotted)

    # Merge into the refs file (keyed by version).
    refs_path = Path(refs_file)
    all_refs: dict[str, dict[str, str]] = {}
    if refs_path.exists():
        all_refs = json.loads(refs_path.read_text(encoding="utf-8"))
    all_refs[version] = version_refs
    refs_path.parent.mkdir(parents=True, exist_ok=True)
    refs_path.write_text(json.dumps(all_refs, indent="\t"), encoding="utf-8")

    print(
        f"  Generated {len(generated)} reference pages, "
        f"{len(version_refs)} refs for version '{version}'"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
