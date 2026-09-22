import { HomePage } from "@/components/pages/HomePage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.home.metadataTitle,
  content.vi.metadata.description,
  "/",
  "vi",
  true,
);
export default function Page() {
  return <HomePage locale="vi" />;
}
