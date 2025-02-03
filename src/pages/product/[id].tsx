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
  category: {
    id: string;
    name: string;
  };
}

const fakeReviews = [
  { id: 1, rating: 5 },
  { id: 2, rating: 4 },
  { id: 3, rating: 3 },
  { id: 4, rating: 2 },
];

interface ProductDetailProps {
  product?: Product;
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

// Calculate the average rating (Move it outside the function)
const averageRating = fakeReviews.reduce((sum, review) => sum + review.rating, 0) / fakeReviews.length;

  if (!product) return <p>Product not found!</p>;
  return (
    <div className="bg-urbanChic-100 p-4 mt-32 mb-56">
      {/* Flex container for layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-5xl mx-auto gap-12">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title || "Product Image"}
            width={500} 
            height={500} 
            className="rounded-lg mx-auto md:mx-0"
          />
        </div>
  
        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2">
          
          {/* Product Title */}
          <h1 className="text-4xl text-urbanChic-600">{product.title}</h1>
  
          {/* Overall Rating - Below Title */}
          <div className="mt-2 mb-4">
            <span className="bg-gray-100 p-2 rounded-lg shadow-sm text-yellow-500 text-xl inline-block">
              {"⭐".repeat(Math.round(averageRating))} {/* Show average rating stars */}
            </span>
          </div>
  
          {/* Product Category - Styled as a Small Rounded Badge */}
          {product.category?.name && (
            <div className="mt-4 mb-6 flex justify-start">
              <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>
          )}
  
          {/* Product Description */}
          <h1 className="text-3xl text-urbanChic-600 mb-4">PRODUCT DETAILS</h1>
          <p className="text-gray-600 mb-8 italic text-xl">{product.description}</p>
  
          {/* Product Price */}
          <p className="text-2xl font-semibold mb-6">
            {product.price ? `$${product.price.toFixed(2)}` : "Price unavailable"}
          </p>
  
          {/* Add to Cart Button */}
          <div className="flex">
            <button
              className="bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
  
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
