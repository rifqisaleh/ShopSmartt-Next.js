import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../components/cart";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found!</p>;

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

  return (
    <div className="bg-urbanChic-100 p-4 mt-32 mb-56">
      <h1 className="text-4xl text-urbanChic-600 mb-16 text-center">{product.title}</h1>
      <img
        src={product.images?.[0] || "https://via.placeholder.com/150"}
        alt={product.title}
        className="w-full max-w-md mx-auto mb-16"
      />
      <p className="text-gray-600 mb-8 text-center italic text-xl">{product.description}</p>
      <p className="text-2xl font-semibold mb-24 mt-24 text-center">
        {product.price ? `$${product.price.toFixed(2)}` : "Price unavailable"}
      </p>
      <div className="flex justify-center ">
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
