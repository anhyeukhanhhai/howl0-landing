import { ForYouPage } from "@/components/pages/ForYouPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.forYou.metadataTitle,
  content.en.forYou.intro,
  "/for-you",
  "en",
);
export default function Page() {
  return <ForYouPage locale="en" />;
}
