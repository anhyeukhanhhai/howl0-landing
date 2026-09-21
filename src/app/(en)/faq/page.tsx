import { FaqPage } from "@/components/pages/FaqPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.faq.metadataTitle,
  content.en.faq.note,
  "/faq",
  "en",
);
export default function Page() {
  return <FaqPage locale="en" />;
}
