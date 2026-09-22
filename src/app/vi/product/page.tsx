import { ProductPage } from "@/components/pages/ProductPage";
import { content } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  content.vi.product.metadataTitle,
  content.vi.product.intro,
  "/product",
  "vi",
);
export default function Page() {
  return <ProductPage locale="vi" />;
}
