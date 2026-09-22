import { PeoplePage } from "@/components/pages/PeoplePage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.people.metadataTitle,
  content.vi.people.intro,
  "/people",
  "vi",
);

export default function Page() {
  return <PeoplePage locale="vi" />;
}
