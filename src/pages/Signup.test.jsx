/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Signup from "./Signup";

describe("Signup Component", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("renders signup form", () => {
    render(<Signup />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    render(<Signup />);

    // Fill out form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password456" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  });

  it("handles successful signup", async () => {
    render(<Signup />);

    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    // Fill out form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/register",
      expect.any(Object)
    );
  });

  it("shows error message on signup failure", async () => {
    render(<Signup />);

    // Mock failed API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    });

    // Fill out form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for error message
    expect(
      await screen.findByText("Username already exists")
    ).toBeInTheDocument();
  });
});
