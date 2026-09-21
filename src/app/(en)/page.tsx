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

export default function Page() {
  return <HomePage locale="en" />;
}
