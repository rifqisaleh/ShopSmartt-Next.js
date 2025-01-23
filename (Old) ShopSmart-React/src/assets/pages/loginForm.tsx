import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" }); // Manage form inputs
  const [error, setError] = useState<string | null>(null); // Store any login errors
  const navigate = useNavigate(); // Navigate to other pages
  const { login } = useAuth(); // Access authentication methods

  // Handle changes in form input fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update form data for the specific input
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the page from refreshing
    setError(null); // Reset previous errors

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
        method: "POST", // HTTP method for login
        headers: {
          "Content-Type": "application/json", // JSON content type
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error Response:", errorResponse);
        throw new Error(errorResponse.message || "Invalid credentials."); // Handle errors
      }

      const data = await response.json();

      // Store tokens in localStorage and update authentication state
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      login(data.access_token, data.refresh_token); // Update authentication state
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred."); // Display error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-urbanChic-100 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="mt-6 text-3xl text-center text-black">Welcome Back!</h2>
        <p className="text-sm text-gray-600 text-center mt-2">Login to your account</p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>} {/* Display errors */}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange} // Update email state
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // Update password state
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
