import { WhyHowl0Page } from "@/components/pages/WhyHowl0Page";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.why.metadataTitle,
  content.en.why.intro,
  "/why-howl0",
  "en",
);
export default function Page() {
  return <WhyHowl0Page locale="en" />;
}
