import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/products";
import { ProductView } from "./ProductView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
