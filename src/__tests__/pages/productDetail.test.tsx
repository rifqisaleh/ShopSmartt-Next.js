// import { render, screen, fireEvent } from '@testing-library/react';
// import ProductDetail from '@/pages/product/[id]';
// import { CartContext, CartContextProps } from '@/context/CartContext';

// describe('ProductDetail Component', () => {
//   // Mock product data
//   const mockProduct = {
//     id: 1,
//     title: 'Test Product',
//     description: 'This is a test product description.',
//     price: 99.99,
//     images: ['/test-image.jpg'],
//   };

//   // Mock CartContext
//   const mockCartContext: CartContextProps = {
//     cart: [],
//     cartCount: 0,
//     addToCart: jest.fn(),
//     updateCart: jest.fn(),
//   };

//   // Test 1: Verify that ProductDetail renders product details correctly
//   test('renders product details correctly', () => {
//     render(
//       <CartContext.Provider value={mockCartContext}>
//         <ProductDetail product={mockProduct} /> {/* Pass mockProduct as prop */}
//       </CartContext.Provider>
//     );

//     // Check if product details are rendered
//     expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
//     expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
//     expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
//     expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
//   });

//   // Test 2: Verify "Add to Cart" functionality
//   test('calls addToCart when "Add to Cart" button is clicked', () => {
//     render(
//       <CartContext.Provider value={mockCartContext}>
//         <ProductDetail product={mockProduct} />
//       </CartContext.Provider>
//     );

//     // Find and click the "Add to Cart" button
//     const addToCartButton = screen.getByText(/add to cart/i);
//     fireEvent.click(addToCartButton);

//     // Verify addToCart was called with the correct product
//     expect(mockCartContext.addToCart).toHaveBeenCalledWith({
//       id: mockProduct.id,
//       title: mockProduct.title,
//       price: mockProduct.price,
//       images: mockProduct.images,
//     });
//   });

//   // Test 3: Verify fallback for missing product
//   test('renders "Product not found!" when product is undefined', () => {
//     render(<ProductDetail product={undefined} />);

//     // Check for fallback message
//     expect(screen.getByText(/product not found!/i)).toBeInTheDocument();
//   });
// });
