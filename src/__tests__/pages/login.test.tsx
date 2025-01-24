// import { render, screen, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { useRouter } from "next/router";
// import { useAuth } from "@/context/AuthContext";
// import Login from "@/pages/login";
// import "@testing-library/jest-dom";
// import { act } from "@testing-library/react";
// import { server } from "../setupTests"; // Import your MSW server
// import { rest } from "msw";

// // Mocking `next/router` to simulate router behavior without actual navigation
// jest.mock("next/router", () => ({
//   useRouter: jest.fn(),
// }));

// // Mocking the authentication context to simulate login behavior
// jest.mock("@/context/AuthContext", () => ({
//   useAuth: jest.fn(),
// }));

// describe("Login Component", () => {
//   const mockPush = jest.fn(); // Mocked `push` function for navigation
//   const mockLogin = jest.fn(); // Mocked `login` function for authentication

//   beforeAll(() => {
//     server.listen(); // Start the MSW server before tests
//   });

//   afterEach(() => {
//     server.resetHandlers(); // Reset handlers after each test
//     jest.clearAllMocks(); // Clear mocks to avoid contamination
//   });

//   afterAll(() => {
//     server.close(); // Stop the MSW server after all tests
//   });

//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue({ push: mockPush }); // Mock `push` navigation
//     (useAuth as jest.Mock).mockReturnValue({ login: mockLogin }); // Mock authentication context
//   });

//   it("renders the login form", () => {
//     render(<Login />);

//     expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
//   });

//   it("updates form state on input change", async () => {
//     render(<Login />);

//     const emailInput = screen.getByLabelText(/Email/i);
//     const passwordInput = screen.getByLabelText(/Password/i);

//     await userEvent.type(emailInput, "test@example.com");
//     expect(emailInput).toHaveValue("test@example.com");

//     await userEvent.type(passwordInput, "password123");
//     expect(passwordInput).toHaveValue("password123");
//   });

//   it("submits the form with correct data", async () => {
//     render(<Login />);

//     const emailInput = screen.getByLabelText(/Email/i);
//     const passwordInput = screen.getByLabelText(/Password/i);
//     const submitButton = screen.getByRole("button", { name: /Login/i });

//     await userEvent.type(emailInput, "test@example.com");
//     await userEvent.type(passwordInput, "password123");

//     await act(async () => {
//       fireEvent.click(submitButton);
//     });

//     expect(mockLogin).toHaveBeenCalledWith("mockAccessToken", "mockRefreshToken");
//     expect(mockPush).toHaveBeenCalledWith("/dashboard");
//   });

//   it("displays an error message when login fails", async () => {
//     server.use(
//       rest.post("/auth/login", (req, res, ctx) => {
//         return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
//       })
//     );

//     render(<Login />);

//     const emailInput = screen.getByLabelText(/Email/i);
//     const passwordInput = screen.getByLabelText(/Password/i);
//     const submitButton = screen.getByRole("button", { name: /Login/i });

//     await userEvent.type(emailInput, "test@example.com");
//     await userEvent.type(passwordInput, "wrongpassword");

//     fireEvent.click(submitButton);

//     expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
//   });
// });
