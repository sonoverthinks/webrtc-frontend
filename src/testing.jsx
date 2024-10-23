// /* eslint-disable no-undef */
// // App.test.jsx
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import { vi } from "vitest";
// import App from "./App";
// import { AuthProvider } from "./contexts/AuthContext";
// import { SocketProvider } from "./contexts/SocketContext";

// // Mock the auth context
// vi.mock("./contexts/AuthContext", () => ({
//   AuthProvider: ({ children }) => children,
//   useAuth: () => ({
//     isAuthenticated: false,
//     login: vi.fn(),
//     logout: vi.fn(),
//     user: null,
//   }),
// }));

// // Mock the socket context
// vi.mock("./contexts/SocketContext", () => ({
//   SocketProvider: ({ children }) => children,
//   useSocket: () => ({
//     socket: null,
//     isConnected: false,
//   }),
// }));

// const renderWithRouter = (ui, { route = "/" } = {}) => {
//   return render(
//     <AuthProvider>
//       <SocketProvider>
//         <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
//       </SocketProvider>
//     </AuthProvider>
//   );
// };

// describe("App Component", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("renders dashboard route when authenticated", () => {
//     vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//       isAuthenticated: true,
//       user: { id: "1", name: "Test User" },
//       login: vi.fn(),
//       logout: vi.fn(),
//     }));

//     renderWithRouter(<App />, { route: "/dashboard" });
//     expect(screen.getByText("Dashboard")).toBeInTheDocument();
//   });

//   it("redirects to dashboard from root route when authenticated", () => {
//     vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//       isAuthenticated: true,
//       user: { id: "1", name: "Test User" },
//       login: vi.fn(),
//       logout: vi.fn(),
//     }));

//     renderWithRouter(<App />, { route: "/" });
//     expect(screen.getByText("Dashboard")).toBeInTheDocument();
//   });

//   it("renders signin route when not authenticated", () => {
//     renderWithRouter(<App />, { route: "/signin" });
//     expect(screen.getByText("Sign In")).toBeInTheDocument();
//     expect(
//       screen.getByRole("button", { name: /sign in/i })
//     ).toBeInTheDocument();
//   });

//   it("renders signup route when not authenticated", () => {
//     renderWithRouter(<App />, { route: "/signup" });
//     expect(screen.getByText("Sign Up")).toBeInTheDocument();
//     expect(
//       screen.getByRole("button", { name: /sign up/i })
//     ).toBeInTheDocument();
//   });

//   it("redirects to signin when accessing protected route while not authenticated", () => {
//     renderWithRouter(<App />, { route: "/dashboard" });
//     expect(screen.getByText("Sign In")).toBeInTheDocument();
//     expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
//   });

//   it("shows error message for invalid routes", () => {
//     renderWithRouter(<App />, { route: "/invalid-route" });
//     expect(screen.getByText(/page not found/i)).toBeInTheDocument();
//   });

//   describe("Authentication Flow", () => {
//     it("successfully logs in and redirects to dashboard", async () => {
//       const mockLogin = vi.fn().mockResolvedValue(true);
//       vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//         isAuthenticated: false,
//         login: mockLogin,
//         logout: vi.fn(),
//         user: null,
//       }));

//       renderWithRouter(<App />, { route: "/signin" });

//       const emailInput = screen.getByLabelText(/email/i);
//       const passwordInput = screen.getByLabelText(/password/i);
//       const submitButton = screen.getByRole("button", { name: /sign in/i });

//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       fireEvent.click(submitButton);

//       await waitFor(() => {
//         expect(mockLogin).toHaveBeenCalledWith({
//           email: "test@example.com",
//           password: "password123",
//         });
//       });
//     });

//     it("shows error message on login failure", async () => {
//       const mockLogin = vi
//         .fn()
//         .mockRejectedValue(new Error("Invalid credentials"));
//       vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//         isAuthenticated: false,
//         login: mockLogin,
//         logout: vi.fn(),
//         user: null,
//       }));

//       renderWithRouter(<App />, { route: "/signin" });

//       const submitButton = screen.getByRole("button", { name: /sign in/i });
//       fireEvent.click(submitButton);

//       await waitFor(() => {
//         expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
//       });
//     });

//     it("successfully logs out and redirects to signin", async () => {
//       const mockLogout = vi.fn();
//       vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//         isAuthenticated: true,
//         login: vi.fn(),
//         logout: mockLogout,
//         user: { id: "1", name: "Test User" },
//       }));

//       renderWithRouter(<App />, { route: "/dashboard" });

//       const logoutButton = screen.getByRole("button", { name: /logout/i });
//       fireEvent.click(logoutButton);

//       await waitFor(() => {
//         expect(mockLogout).toHaveBeenCalled();
//         expect(screen.getByText("Sign In")).toBeInTheDocument();
//       });
//     });
//   });

//   describe("Socket Connection", () => {
//     it("establishes socket connection when authenticated", () => {
//       const mockSocket = { connect: vi.fn(), disconnect: vi.fn() };
//       vi.mocked("./contexts/SocketContext").useSocket.mockImplementation(
//         () => ({
//           socket: mockSocket,
//           isConnected: true,
//         })
//       );

//       vi.mocked("./contexts/AuthContext").useAuth.mockImplementation(() => ({
//         isAuthenticated: true,
//         user: { id: "1", name: "Test User" },
//         login: vi.fn(),
//         logout: vi.fn(),
//       }));

//       renderWithRouter(<App />, { route: "/dashboard" });
//       expect(screen.getByText("Connected")).toBeInTheDocument();
//     });
//   });
// });
