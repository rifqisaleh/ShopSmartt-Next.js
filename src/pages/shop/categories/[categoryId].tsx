import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";
import { Product, categoryMap } from "..";

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    searchQuery: "",
    priceRange: [0, 500],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryData = async () => {
      try {
        const resProducts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}products/?categoryId=${categoryId}`
        );
        if (!resProducts.ok) throw new Error("Failed to fetch products");

        const resCategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!resCategories.ok) throw new Error("Failed to fetch categories");

        const productData: Product[] = await resProducts.json();
        const categoryData: { id: string; name: string }[] = await resCategories.json();

        // Standardize products and categories
        const standardizedProducts = productData.map((product) => ({
          ...product,
          category: {
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"],
          },
          images: Array.isArray(product.images) ? product.images : [],
        }));
        const standardizedCategories = categoryData.map((category) => ({
          id: category.id,
          name: categoryMap[category.id] || "Misc",
        }));

        setProducts(standardizedProducts);
        setCategories(standardizedCategories);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products or categories.");
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  const displayedProducts = products.filter((product) => {
    const matchesSearchQuery = product.title
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase());
    const withinPriceRange =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    return matchesSearchQuery && withinPriceRange;
  });

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 p-4 mb-16 mt-16">
      <div className="lg:w-1/4 w-full space-y-6 mb-4 lg:mb-0">
        <CategoryFilter
          filters={{
            categoryId: String(categoryId) || null,
            ...filters,
          }}
          categories={categories}
          onFilterChange={(updatedFilters) =>
            setFilters((prev) => ({ ...prev, ...updatedFilters }))
          }
        />
      </div>
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
