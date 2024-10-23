/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Signin from "./Signin";

// Mock navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Signin Component", () => {
  const mockLogin = vi.fn();
  const mockFetch = vi.fn();

  // Basic setup for tests
  const renderSignin = () => {
    const authContext = {
      login: mockLogin,
      logout: vi.fn(),
      token: null,
      userData: null,
    };

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Signin />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  it("renders signin form", () => {
    renderSignin();

    // expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows error when fields are empty", async () => {
    renderSignin();

    // Submit empty form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Please provide username and password")
    ).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    renderSignin();

    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "fake-token",
        userData: { username: "testuser" },
      }),
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/login",
      expect.any(Object)
    );
  });

  it("shows error message on failed login", async () => {
    renderSignin();

    // Mock failed API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
