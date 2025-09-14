import HomeCarousel from "../components/HomeCarousel";
import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full py-8">
        <HomeCarousel />
      </div>
      <section className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 drop-shadow-lg">Shop Trending Products</h1>
        <ProductList />
      </section>
    </main>
  );
}
