import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "@/pages/register";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { act } from "react"; // Importing `act` for wrapping state updates during tests

// Mocking next/router to simulate router behavior without actually navigating during tests
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(), // Mock `push` for redirection
    pathname: "/",    // Mock the current path
    query: {},        // Mock the query object
    asPath: "/",      // Mock the current path as a string
  })),
}));

// Before each test, mock the fetch API and render the component
beforeEach(async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://mock-api.com/"; // Mock the API base URL

  // Mock `fetch` to simulate fetching roles from an API
  (global.fetch as jest.Mock) = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ role: "Admin" }, { role: "Customer" }]), // Mock response for roles
    })
  );

  // Render the `Register` component and wrap it in `act` to ensure state updates are handled properly
  await act(async () => {
    render(<Register />);
  });
});

// After each test, clear all mocks to prevent cross-test contamination
afterEach(() => {
  jest.clearAllMocks();
});

describe("Register Component", () => {
  // Test case to ensure all form fields are rendered correctly
  test("renders the registration form", () => {
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
  });

  // Test case to verify the form state updates when input fields are changed
  test("updates form state on input change", () => {
    // Simulate typing into the "Name" field
    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");

    // Simulate typing into the "Email" field
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  });

  // Test case to verify that validation errors are displayed for invalid inputs
  test("displays error messages for invalid inputs", async () => {
    const submitButton = screen.getByRole("button", { name: /register/i });

    // Simulate clicking the submit button without filling the form
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Debug the DOM during the test to identify issues
    screen.debug();

    // Ensure validation errors are displayed
    expect(await screen.findByText((content) => content.includes("Name is required"))).toBeInTheDocument();
    expect(await screen.findByText((content) => content.includes("Email is required"))).toBeInTheDocument();
    expect(await screen.findByText((content) => content.includes("Password is required"))).toBeInTheDocument();
  });

  // Test case to verify form submission with valid data and API interaction
  test("submits the form with correct data", async () => {
    // Simulate filling all required fields
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.change(screen.getByLabelText("Date of Birth"), { target: { value: "2000-01-01" } });

    // Mock the `fetch` API for form submission
    (global.fetch as jest.Mock).mockImplementationOnce((url, options) => {
      // Ensure the API is called with the correct URL and payload
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
        json: () => Promise.resolve({}), // Mock successful API response
      });
    });

    // Simulate clicking the submit button
    const submitButton = screen.getByRole("button", { name: /register/i });
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Verify that the `fetch` API was called once
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
