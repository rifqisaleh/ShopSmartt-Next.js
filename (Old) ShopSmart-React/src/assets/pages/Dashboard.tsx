import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isError = (err: unknown): err is Error => {
    return err instanceof Error;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      
      try {
        const token = localStorage.getItem("token"); // Ensure consistency
       
        if (!token) throw new Error("Unauthorized");

        const requestUrl = `${import.meta.env.VITE_API_URL}auth/profile`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
       

        const response = await fetch(requestUrl, {
          method: "GET",
          headers,
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Response Error Data:", errorData);
          throw new Error(errorData.message || "Failed to fetch profile.");
        }

        const data = await response.json();
        
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (isError(err)) {
          setError(err.message);
          if (err.message === "Unauthorized") {
            
            logout();
            navigate("/login");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );

      if (!confirmDelete) {
        return;
      }

      const token = localStorage.getItem("token"); // Ensure consistency
      console.log("Token retrieved for account deletion:", token);
      if (!token) throw new Error("Unauthorized");

      const requestUrl = `${import.meta.env.VITE_API_URL}auth/profile`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      

      const response = await fetch(requestUrl, {
        method: "DELETE",
        headers,
      });

      

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response Error Data for Deletion:", errorData);
        throw new Error(errorData.message || "Failed to delete the account.");
      }

      alert("Your account has been deleted.");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err instanceof Error ? err.message : "Unexpected error.");
    }
  };

  if (error) {
    console.error("Displaying error to the user:", error);
    return <p className="text-red-500">{error}</p>;
  }

  if (!profile) {
    console.log("Profile is null. Displaying loading message...");
    return <p>Loading profile...</p>;
  }

  console.log("Rendering dashboard with user profile:", profile);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-urbanChic-50 shadow-lg rounded-lg p-8 w-full max-w-md mb-24 mt-24">
        <h1 className="text-3xl text-center mb-16 mt-16 text-urbanChic-600">
          Welcome, {profile.name}!
        </h1>
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mt-12 mb-12"
          />
        )}
        <p className="text-gray-600 text-center mt-6">Email: {profile.email}</p>
        <p className="text-gray-600 text-center mt-6 mb-16">Role: {profile.role}</p>
        <div className="mt-6 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none"
          >
            Log Out
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 focus:outline-none"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
