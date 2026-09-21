import { HowItWorksPage } from "@/components/pages/HowItWorksPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.howItWorks.metadataTitle,
  content.vi.howItWorks.intro,
  "/how-it-works",
  "vi",
);
export default function Page() {
  return <HowItWorksPage locale="vi" />;
}
