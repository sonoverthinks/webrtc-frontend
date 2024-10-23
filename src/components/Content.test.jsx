/* eslint-disable no-undef */
// Content.test.jsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SocketContext } from "../SocketContext";
import Content from "./Content";

// Mock the Video component
vi.mock("./Video", () => ({
  default: ({ user }) => (
    <div data-testid={`video-${user}`}>Mock Video: {user}</div>
  ),
}));

describe("Content Component", () => {
  // Helper function to render with context
  const renderWithContext = (contextValue) => {
    return render(
      <SocketContext.Provider value={contextValue}>
        <Content />
      </SocketContext.Provider>
    );
  };

  // Mock video references
  const mockMyVideo = { current: { srcObject: "mock-stream" } };
  const mockUserVideo = { current: { srcObject: "mock-peer-stream" } };

  it("renders user video by default", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: false,
      callEnded: false,
      call: {},
      userVideo: null,
    };

    renderWithContext(contextValue);

    expect(screen.getByTestId("video-you")).toBeInTheDocument();
    expect(screen.queryByTestId("video-undefined")).not.toBeInTheDocument();
  });

  it("renders both videos when call is accepted and not ended", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: true,
      callEnded: false,
      call: { name: "John" },
      userVideo: mockUserVideo,
    };

    renderWithContext(contextValue);

    expect(screen.getByTestId("video-you")).toBeInTheDocument();
    expect(screen.getByTestId("video-John")).toBeInTheDocument();
  });

  it("does not render peer video when call is ended", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: true,
      callEnded: true,
      call: { name: "John" },
      userVideo: mockUserVideo,
    };

    renderWithContext(contextValue);

    expect(screen.getByTestId("video-you")).toBeInTheDocument();
    expect(screen.queryByTestId("video-John")).not.toBeInTheDocument();
  });

  it("does not render peer video when call is not accepted", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: false,
      callEnded: false,
      call: { name: "John" },
      userVideo: mockUserVideo,
    };

    renderWithContext(contextValue);

    expect(screen.getByTestId("video-you")).toBeInTheDocument();
    expect(screen.queryByTestId("video-John")).not.toBeInTheDocument();
  });

  it("handles missing name in call object", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: true,
      callEnded: false,
      call: {}, // Missing name
      userVideo: mockUserVideo,
    };

    renderWithContext(contextValue);

    expect(screen.getByTestId("video-you")).toBeInTheDocument();
    expect(screen.getByTestId("video-undefined")).toBeInTheDocument();
  });

  it("renders with correct CSS classes", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: false,
      callEnded: false,
      call: {},
      userVideo: null,
    };

    const { container } = renderWithContext(contextValue);

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass(
      "grid",
      "flex-1",
      "gap-4",
      "p-4",
      "lg:grid-cols-2"
    );
  });

  // Test responsiveness
  it("maintains responsive layout classes", () => {
    const contextValue = {
      myVideo: mockMyVideo,
      callAccepted: true,
      callEnded: false,
      call: { name: "John" },
      userVideo: mockUserVideo,
    };

    const { container } = renderWithContext(contextValue);

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("lg:grid-cols-2");
  });
});
