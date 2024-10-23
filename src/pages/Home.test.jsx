import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Home from "./Home";

// Mock child components
vi.mock("../components/SideNav", () => ({
  default: () => <div data-testid="sidenav">SideNav</div>,
}));

vi.mock("../components/Content", () => ({
  default: () => <div data-testid="content">Content</div>,
}));

vi.mock("../components/Control", () => ({
  default: () => <div data-testid="control">Control</div>,
}));

describe("Home Component", () => {
  it("renders all components in the correct layout", () => {
    render(<Home />);

    // Check if all components are rendered
    const sidenav = screen.getByTestId("sidenav");
    const content = screen.getByTestId("content");
    const control = screen.getByTestId("control");

    expect(sidenav).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(control).toBeInTheDocument();

    // Check layout structure
    const mainContainer = sidenav.parentElement;
    expect(mainContainer).toHaveClass("flex h-screen");

    const rightColumn = content.parentElement;
    expect(rightColumn).toHaveClass("flex flex-col flex-1");
    expect(rightColumn).toContainElement(control);
  });
});
