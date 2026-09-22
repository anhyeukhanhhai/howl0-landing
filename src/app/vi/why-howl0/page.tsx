import { WhyHowl0Page } from "@/components/pages/WhyHowl0Page";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.why.metadataTitle,
  content.vi.why.intro,
  "/why-howl0",
  "vi",
);
export default function Page() {
  return <WhyHowl0Page locale="vi" />;
}
