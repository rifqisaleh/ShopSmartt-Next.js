import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { categoryMap } from "../pages/productList"; // Import categoryMap

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[] | string | null;
  description?: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  image: string;
}

const LandingPage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products: Product[] = await response.json();

        // Get unique products for the carousel
        const uniqueFeaturedProducts = new Map();
        products.forEach((product) => {
          if (
            !uniqueFeaturedProducts.has(product.category?.id) &&
            uniqueFeaturedProducts.size < 3
          ) {
            uniqueFeaturedProducts.set(product.category?.id, product);
          }
        });

        setFeaturedProducts(Array.from(uniqueFeaturedProducts.values()));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await response.json();

        // Filter categories based on allowed IDs in categoryMap
        const allowedCategoryIds = Object.keys(categoryMap); // Get IDs from categoryMap
        const filteredCategories = data.filter((category) =>
          allowedCategoryIds.includes(category.id.toString())
        );

        // Map IDs to standardized names
        const standardizedCategories = filteredCategories.map((category) => ({
          ...category,
          name: categoryMap[category.id.toString()], // Map to standardized name
        }));

        setCategories(standardizedCategories);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getFirstImage = (images: string[] | string | null): string | undefined => {
    if (Array.isArray(images)) {
      return images.length > 0 ? images[0] : undefined; // Get first image in array
    }
    return typeof images === "string" ? images : undefined; // Handle single string or null
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-7xl mt-16 mb-16">
        {/* Left Section */}
        <div className="sm:w-1/2 p-4">
          <h1 className="text-6xl  mb-16 text-urbanChic-600">Welcome to ShopSmart!</h1>
          <p className="text-2xl text-gray-700 italic">
            Discover amazing products from a variety of categories.
          </p>
        </div>

       {/* Right Section: Carousel */}
<div className="w-full sm:w-1/2 p-4">
  {error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <Slider {...settings}>
      {featuredProducts.map((product) => (
        <div
          key={product.id}
          className="p-4 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={getFirstImage(product.images) || "/placeholder.jpeg"}
            alt={product.title}
            className="w-full h-auto max-h-96 object-cover rounded mb-2 hover:opacity-90 transition-opacity"
          />
          <h2 className="text-xl font-semibold text-center">{product.title}</h2>
        </div>
      ))}
    </Slider>
  )}
</div>
      </div>

      {/* Category Section */}
      <div className="w-full max-w-7xl mt-16 mb-16">
        <h2 className="text-5xl text-urbanChic-600 mb-16 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/shop?category=${category.id}`)}
            >
              {/* Category Image */}
              <img
                src={category.image || "/placeholder.jpeg"}
                alt={category.name}
                className="w-28 h-28 sm:w-36 sm:h-36 object-cover hover:scale-105 transition-transform"
                onError={(e) => {
                  console.error(`Failed to load image for category ${category.name}:`, category.image);
                  e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
                }}
              />
              {/* Category Name */}
              <span className="mt-2 text-sm text-gray-600 font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;