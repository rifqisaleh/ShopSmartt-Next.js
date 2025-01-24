// import { render, screen, waitFor } from "@testing-library/react";
// import Dashboard from "@/pages/dashboard";
// import { useRouter } from "next/router";
// import { AuthProvider } from "@/context/AuthContext"; // If your component depends on context
// import { server } from "@/__tests__/setupTests"; // Import your MSW server setup
// import { rest } from "msw";


// jest.mock("next/router", () => ({
//   useRouter: jest.fn(),
// }));

// beforeEach(() => {
//   (useRouter as jest.Mock).mockReturnValue({
//     push: jest.fn(),
//     pathname: "/dashboard",
//     query: {},
//   });
// });

// afterEach(() => {
//   jest.clearAllMocks();
//   server.resetHandlers(); // Reset MSW handlers between tests
// });

// describe("Dashboard", () => {
//   it("renders user profile when authenticated", async () => {
//     // Mock the /auth/profile API response to return user profile data
//     server.use(
//       rest.get(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, (req, res, ctx) => {
//         console.log("Mock profile handler hit");
//         return res(
//           ctx.status(200),
//           ctx.json({
//             id: 1,
//             name: "Test User",
//             email: "test@example.com",
//             avatar: "/test-avatar.jpg",
//             role: "Customer",
//           })
//         );
//       })
//     );

//     render(
//       <AuthProvider>
//         <Dashboard profile={null} />
//       </AuthProvider>
//     );

//     // Wait for the profile to load and assert the user information is displayed
//     await waitFor(() => {
//       expect(screen.getByText(/Welcome, Test User!/i)).toBeInTheDocument();
//     });

//     // Assert the user information is displayed
//     expect(screen.getByText(/Welcome, Test User!/i)).toBeInTheDocument();
//     expect(screen.getByText(/Email: test@example.com/i)).toBeInTheDocument();
//     expect(screen.getByText(/Role: Customer/i)).toBeInTheDocument();
//   });

//   it("redirects to login when no profile is found", async () => {
//     const pushMock = jest.fn();
//     (useRouter as jest.Mock).mockReturnValue({
//       push: pushMock,
//       pathname: "/dashboard",
//       query: {},
//     });

//     // Mock the /auth/profile API response to return 401 Unauthorized
//     server.use(
//       rest.get(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, (req, res, ctx) => {
//         console.log("Unauthorized profile handler hit");
//         return res(ctx.status(401), ctx.json({ message: "Unauthorized" }));
//       })
//     );

//     render(
//       <AuthProvider>
//         <Dashboard profile={null} />
//       </AuthProvider>
//     );

//     // Wait for redirection to login
//     await waitFor(() => {
//       expect(pushMock).toHaveBeenCalledWith("/login");
//     });
//   });
// });

