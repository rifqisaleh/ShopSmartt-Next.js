import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/login";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { act } from "@testing-library/react";


// Mocking necessary modules
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

describe("Login Component", () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<Login />);
    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("updates form state on input change", async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");

    await userEvent.type(passwordInput, "password123");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits the form with correct data", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "mockAccessToken",
        refresh_token: "mockRefreshToken",
      }),
    });
  
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });
  
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
  
    // Wrap the click event in act to resolve the warning
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Verify `login` is called with correct data
    expect(mockLogin).toHaveBeenCalledWith("mockAccessToken", "mockRefreshToken");
  
    // Verify navigation to /dashboard
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
  

  it("displays an error message when login fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
