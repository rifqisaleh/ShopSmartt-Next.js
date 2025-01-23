import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/login";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { act } from "@testing-library/react";

// Mocking `next/router` to simulate router behavior without actual navigation
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mocking the authentication context to simulate login behavior
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mocking `fetch` globally to simulate API requests
global.fetch = jest.fn() as jest.Mock;

describe("Login Component", () => {
  const mockPush = jest.fn(); // Mocked `push` function for navigation
  const mockLogin = jest.fn(); // Mocked `login` function for authentication

  beforeEach(() => {
    // Mock `useRouter` to return the mocked `push` function
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock `useAuth` to return the mocked `login` function
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });

    // Clear all previous `fetch` calls before each test
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    // Clear all mocks after each test to prevent cross-test contamination
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    // Render the `Login` component
    render(<Login />);

    // Verify all essential elements of the login form are rendered
    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("updates form state on input change", async () => {
    // Render the `Login` component
    render(<Login />);

    // Get email and password input fields
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate typing into the email field
    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");

    // Simulate typing into the password field
    await userEvent.type(passwordInput, "password123");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits the form with correct data", async () => {
    // Mock a successful API response for login
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "mockAccessToken",
        refresh_token: "mockRefreshToken",
      }),
    });

    // Render the `Login` component
    render(<Login />);

    // Get email, password input fields, and the submit button
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    // Simulate typing into both fields
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Simulate clicking the submit button and wrap in `act`
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify the `login` function is called with correct tokens
    expect(mockLogin).toHaveBeenCalledWith("mockAccessToken", "mockRefreshToken");

    // Verify the user is redirected to the dashboard
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("displays an error message when login fails", async () => {
    // Mock an unsuccessful API response for login
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    // Render the `Login` component
    render(<Login />);

    // Get email, password input fields, and the submit button
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    // Simulate typing incorrect credentials into both fields
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "wrongpassword");

    // Simulate clicking the submit button
    fireEvent.click(submitButton);

    // Verify the error message is displayed
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});