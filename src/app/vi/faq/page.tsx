import { FaqPage } from "@/components/pages/FaqPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.faq.metadataTitle,
  content.vi.faq.note,
  "/faq",
  "vi",
);
export default function Page() {
  return <FaqPage locale="vi" />;
}
