import React from "react";
import Image from "next/image"; // Import Next.js Image component
import { GetStaticPaths, GetStaticProps } from "next";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const cartContext = useContext(CartContext);

  const handleAddToCart = () => {
    if (cartContext && product) {
      cartContext.addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
      });
    }
  };

  if (!product) return <p>Product not found!</p>;

  return (
    <div className="bg-urbanChic-100 p-4 mt-32 mb-56">
      <h1 className="text-4xl text-urbanChic-600 mb-16 text-center">{product.title}</h1>
      <div className="w-full max-w-md mx-auto mb-16">
        <Image
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title || "Product Image"}
          width={500} // Define the width of the image
          height={500} // Define the height of the image
          className="rounded-lg" 
        />
      </div>
      <p className="text-gray-600 mb-8 text-center italic text-xl">{product.description}</p>
      <p className="text-2xl font-semibold mb-24 mt-24 text-center">
        {product.price ? `$${product.price.toFixed(2)}` : "Price unavailable"}
      </p>
      <div className="flex justify-center">
        <button
          className="bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`);
  const products: Product[] = await res.json();

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`);
    if (!res.ok) {
      return { notFound: true };
    }

    const product: Product = await res.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
};
