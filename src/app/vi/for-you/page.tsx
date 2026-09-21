import { ForYouPage } from "@/components/pages/ForYouPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.forYou.metadataTitle,
  content.vi.forYou.intro,
  "/for-you",
  "vi",
);
export default function Page() {
  return <ForYouPage locale="vi" />;
}
