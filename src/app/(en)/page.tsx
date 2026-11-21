import { EditorialHome } from "@/components/EditorialHome";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "See the progress between lessons",
  "Share a practice take, hear from your teacher, and know what to try next with PARA Music.",
  "/",
  "en",
  true,
);

export default function Page() {
  return <EditorialHome />;
}
