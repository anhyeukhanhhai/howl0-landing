import { PeoplePage } from "@/components/pages/PeoplePage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.en.people.metadataTitle,
  content.en.people.intro,
  "/people",
  "en",
);

export default function Page() {
  return <PeoplePage locale="en" />;
}
