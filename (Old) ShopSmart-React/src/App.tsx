import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./assets/components/layout";
import Input from "./assets/pages/loginForm";
import Register from "./assets/pages/registerForm";
import ProductList from "./assets/pages/productList";
import ProductDetail from "./assets/pages/ProductDetail";
import Dashboard from "./assets/pages/Dashboard"; // Import the Dashboard component
import ProtectedRoute from "./assets/components/ProtectedRoute"; // Import the ProtectedRoute wrapper
import ShoppingCart from "./assets/pages/shoppingCart"; // Adjusted import path
import CartProvider from "./assets/components/cart";
import { AuthProvider } from "./assets/auth/AuthContext";
import LandingPage from "./assets/pages/LandingPages";
import ShippingPolicy from "./assets/pages/ShippingPolicy";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <LandingPage />
      </Layout>
    ),
  },
  {
    path: "/shop",
    element: (
      <Layout>
        <ProductList />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Input />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Layout>
        <ProductDetail />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/cart",
    element: (
      <Layout>
        <ProtectedRoute>
          <ShoppingCart />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/shipping-policy",
    element: (
      <Layout>
        <ShippingPolicy />
      </Layout>
    ),
  },
  {
    path: "*", // Fallback route for 404
    element: (
      <Layout>
        <h1>Page Not Found</h1>
      </Layout>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
