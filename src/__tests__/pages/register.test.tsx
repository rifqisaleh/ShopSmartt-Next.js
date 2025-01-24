// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from "@testing-library/user-event";
// import Register from "@/pages/register";
// import "@testing-library/jest-dom";
// import { server } from '../setupTests';

// jest.mock("next/router", () => ({
//   useRouter: jest.fn(() => ({
//     push: jest.fn(),
//   })),
// }));

// // Mock fetch for roles
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve(["Customer", "Admin"]),
//   })
// ) as jest.Mock;

// describe("Register Component", () => {
//   test("renders the registration form", async () => {
//     render(<Register />);

//     // Wait for roles to load
//     expect(await screen.findByText("Select a role")).toBeInTheDocument();

//     expect(screen.getByLabelText("Name")).toBeInTheDocument();
//     expect(screen.getByLabelText("Email")).toBeInTheDocument();
//     expect(screen.getByLabelText("Password")).toBeInTheDocument();
//     expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
//     expect(screen.getByLabelText("Role")).toBeInTheDocument();
//     expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
//   });

//   test("updates form state on input change", async () => {
//     render(<Register />);

//     // Wait for roles to load
//     await screen.findByText("Select a role");

//     const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
//     fireEvent.change(nameInput, { target: { value: "John Doe" } });
//     expect(nameInput.value).toBe("John Doe");
//   });

//   test("displays error messages for invalid inputs", async () => {
//     render(<Register />);

//     // Wait for roles to load
//     await screen.findByText("Select a role");

//     const submitButton = screen.getByRole("button", { name: /register/i });
//     userEvent.click(submitButton);

//     expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
//   });

//   it('submits the form with valid data', async () => {
//     render(<Register />);
  
//     // Fill out the form
//     fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
//     fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
  
//     // Wait for the roles to load
//     await waitFor(() => expect(screen.getByText('Admin')).toBeInTheDocument());
  
//     fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Admin' } });
//     fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '2000-01-01' } });
  
//     // Submit the form
//     fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
//     // Verify the success message
//     await waitFor(() => {
//       expect(screen.getByText(/User registered successfully/)).toBeInTheDocument();
//     });
//   });
// })  