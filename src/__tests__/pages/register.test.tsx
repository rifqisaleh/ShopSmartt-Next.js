import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "@/pages/register";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { act } from "react";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  })),
}));

// Mock fetch globally
beforeEach(async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://mock-api.com/";

  (global.fetch as jest.Mock) = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ role: "Admin" }, { role: "Customer" }]),
    })
  );

  await act(async () => {
    render(<Register />);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Register Component", () => {
  test("renders the registration form", () => {
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
  });

  test("updates form state on input change", () => {
    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  });

  test("displays error messages for invalid inputs", async () => {
    const submitButton = screen.getByRole("button", { name: /register/i });
    await act(async () => {
      userEvent.click(submitButton);
    })

    // Debug DOM for validation issues
    screen.debug();
// Use a flexible matcher to find the error message
expect(await screen.findByText((content) => content.includes("Name is required"))).toBeInTheDocument();
expect(await screen.findByText((content) => content.includes("Email is required"))).toBeInTheDocument();
expect(await screen.findByText((content) => content.includes("Password is required"))).toBeInTheDocument();
});

  test("submits the form with correct data", async () => {
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.change(screen.getByLabelText("Date of Birth"), { target: { value: "2000-01-01" } });

    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      expect(url).toBe(`${process.env.NEXT_PUBLIC_API_URL}users/`);
      expect(options?.method).toBe("POST");
      expect(JSON.parse(options?.body as string)).toEqual({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Admin",
        dob: "2000-01-01",
        avatar: "https://via.placeholder.com/150",
      });

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    const submitButton = screen.getByRole("button", { name: /register/i });
    await act(async () => {
      userEvent.click(submitButton);
    })

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
