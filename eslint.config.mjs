import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		// Build tooling (CommonJS Node scripts) and generated/output dirs.
		ignores: [
			".next/**",
			"out/**",
			"node_modules/**",
			"docs-versions/**",
			"scripts/**",
		],
	},
	...nextCoreWebVitals,
	...nextTypeScript,
	{
		rules: {
			"react/no-unescaped-entities": "off",
			// These components intentionally set state inside effects to
			// hydrate from browser-only sources (localStorage, matchMedia,
			// fetch) that cannot run during server-side render.
			"react-hooks/set-state-in-effect": "off",
		},
	},
];

export default eslintConfig;
