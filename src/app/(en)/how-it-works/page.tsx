import { HowItWorksPage } from "@/components/pages/HowItWorksPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.howItWorks.metadataTitle,
  content.en.howItWorks.intro,
  "/how-it-works",
  "en",
);
export default function Page() {
  return <HowItWorksPage locale="en" />;
}
