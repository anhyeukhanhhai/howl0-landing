import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomePage } from "@/components/pages/HomePage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.home.metadataTitle,
  content.en.metadata.description,
  "/",
  "en",
  true,
);

export default async function Page() {
  const choice = (await cookies()).get("howl0-language-choice")?.value;
  if (choice === "vi") redirect("/vi");
  if (choice !== "en") redirect("/welcome");
  return <HomePage locale="en" />;
}
