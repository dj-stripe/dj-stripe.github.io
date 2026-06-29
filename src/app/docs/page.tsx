import { redirect } from "next/navigation";

export default function DocsRedirect() {
	// "dev" is the default version visitors land on. /docs/latest still
	// resolves to the latest stable release.
	redirect("/docs/dev");
}
