import { redirect } from "next/navigation";

export default function DocsRedirect() {
	redirect("/docs/latest");
}
