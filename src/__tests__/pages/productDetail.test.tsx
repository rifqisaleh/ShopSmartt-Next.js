import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetail from "@/pages/product/[id]";
import { CartContext, CartContextProps } from "@/context/CartContext";

describe("ProductDetail Component", () => {
  // Mock product data used in tests
  const mockProduct = {
    id: 1,
    title: "Test Product",
    description: "This is a test product description.",
    price: 99.99,
    images: ["/test-image.jpg"], // Mock image array
  };

  // Mock CartContextProps with all required properties
  const mockCartContext: CartContextProps = {
    cart: [], // Mock cart as an empty array
    cartCount: 0, // Initial cart count is set to 0
    addToCart: jest.fn(), // Mock function for adding products to the cart
    updateCart: jest.fn(), // Mock function for updating cart items
  };

  // Test 1: Verify that the ProductDetail component renders all product details correctly
  test("renders product details correctly", () => {
    // Render the ProductDetail component with mock product data
    render(<ProductDetail product={mockProduct} />);

    // Verify that the product title is rendered
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();

    // Verify that the product description is rendered
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

    // Verify that the product price is rendered
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();

    // Verify that the product image is rendered with the correct alt text
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
  });

  // Test 2: Verify that clicking the "Add to Cart" button calls the addToCart function
  test("calls addToCart when 'Add to Cart' button is clicked", () => {
    // Render the ProductDetail component with mock CartContext
    render(
      <CartContext.Provider value={mockCartContext}>
        <ProductDetail product={mockProduct} />
      </CartContext.Provider>
    );

    // Locate the "Add to Cart" button
    const addToCartButton = screen.getByText(/add to cart/i);

    // Simulate a click on the "Add to Cart" button
    fireEvent.click(addToCartButton);

    // Verify that the addToCart function was called with the correct product details
    expect(mockCartContext.addToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      images: mockProduct.images,
    });
  });

  // Test 3: Verify that the fallback message is displayed when the product is undefined
  test("renders 'Product not found!' when product is undefined", () => {
    // Render the ProductDetail component with an undefined product
    render(<ProductDetail product={undefined} />);

    // Verify that the fallback message is displayed
    expect(screen.getByText("Product not found!")).toBeInTheDocument();
  });
});
