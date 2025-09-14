import ProductList from "../../components/ProductList";
import HomeCarousel from "../../components/HomeCarousel";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>E-Com | Home</title>
        <meta name="description" content="Shop the latest minimalist products." />
      </Head>
      <HomeCarousel />
      <ProductList />
    </>
  );
}
