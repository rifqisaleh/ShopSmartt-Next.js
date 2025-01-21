import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import Head from "next/head";
import { GetServerSideProps } from "next";
import cookie from "cookie"; // To parse cookies on the server side
import { useRouter } from "next/router";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface DashboardProps {
  profile: UserProfile | null; // Updated to allow null for better error handling
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!profile) {
      console.log("No profile received in props. Redirecting to login...");
      router.push("/login");
    } else {
      console.log("Profile loaded:", profile);
    }
  }, [profile, router]);

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("Deleting account...");
      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (!confirmDelete) {
        console.log("Account deletion cancelled by user.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${document.cookie.split("token=")[1]}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete account:", errorData);
        throw new Error(errorData.message || "Failed to delete the account.");
      }

      console.log("Account deleted successfully.");
      alert("Your account has been deleted.");
      handleLogout();
    } catch (err) {
      console.error("Error during account deletion:", err);
      alert(err instanceof Error ? err.message : "Unexpected error.");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | ShopSmart</title>
        <meta name="description" content="Welcome to your dashboard at ShopSmart." />
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-urbanChic-50 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl text-center text-urbanChic-600">
            Welcome, {profile.name}!
          </h1>
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mt-6"
            />
          )}
          <p className="text-center mt-4">Email: {profile.email}</p>
          <p className="text-center">Role: {profile.role}</p>
          <div className="mt-6 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900"
            >
              Log Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("getServerSideProps triggered...");
  console.log("Incoming cookies:", context.req.headers.cookie);

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const token = cookies.token;

  console.log("Parsed token from cookies:", token);

  if (!token) {
    console.log("No token found. Redirecting to login...");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Fetch user profile
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Invalid token or API error. Redirecting to login...");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const profile = await response.json();
    console.log("Fetched profile data:", profile);

    return {
      props: { profile },
    };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Dashboard;
