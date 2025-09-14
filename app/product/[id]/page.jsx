import ProductDetail from "../../../components/ProductDetail";

export default function ProductPage({ params }) {
  return <ProductDetail productId={params.id} />;
}
