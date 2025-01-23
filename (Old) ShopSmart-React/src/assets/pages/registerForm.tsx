import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Declare apiUrl at the top of the file
const apiUrl = import.meta.env.VITE_API_URL;

// Define interface for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  dob: string;
}

// Define interface for form errors
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  dob?: string;
  general?: string;
}

const Register = () => {
  // State for managing form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    dob: "",
  });

  interface User {
    role: string;
  }
  // Initialize the navigate function
  const navigate = useNavigate(); 
  // State for dynamic role selection
  const [roles, setRoles] = useState<string[]>(["Customer", "Admin"]); // Default roles
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch roles dynamically
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${apiUrl}users`);
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }

        const users: User[] = await response.json();
        const rolesData = [...new Set(users.map((user) => user.role))];
        
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Handle input field changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

// Validate form inputs
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    
 
    // Show loading indicator
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Example additional field
          dob: formData.dob,   // Example additional field
          avatar: "https://via.placeholder.com/150",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try parsing the error message
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || "Failed to register. Please try again.");
      }
      

      alert("Registration successful!");
      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        dob: "",
      });
     
      // Redirect to login page
      
     navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-urbanChic-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {/* Add Welcome Heading */}
        <h1 className="mt-6 text-3xl text-center text-black mb-16">
          Welcome To ShopSmart!
        </h1>
        {/* Add Create Account Heading */}
        <h2 className="mt-4 text-2xl text-center text-black mb-16">
          Create your account
        </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
            </div>

            {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none"
          > ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
   
  );
};

export default Register;
