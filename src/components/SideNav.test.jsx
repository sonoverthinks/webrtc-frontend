/* eslint-disable no-undef */
// SideNav.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { AuthContext } from "../AuthContext";
import { SocketContext } from "../SocketContext";
import SideNav from "./SideNav";

// Mock the SignOut SVG component
vi.mock("./svg/Signout", () => ({
  default: () => <div data-testid="signout-icon">SignOut Icon</div>,
}));

describe("SideNav Component", () => {
  // Mock functions
  const mockLogout = vi.fn();
  const mockSetName = vi.fn();
  const mockJoinActiveListAs = vi.fn();
  const mockLeaveActiveList = vi.fn();
  const mockCallUser = vi.fn();

  // Helper function to render with both contexts
  const renderWithContexts = (authContextValue, socketContextValue) => {
    return render(
      <AuthContext.Provider value={authContextValue}>
        <SocketContext.Provider value={socketContextValue}>
          <SideNav />
        </SocketContext.Provider>
      </AuthContext.Provider>
    );
  };

  // Default context values
  const defaultAuthContext = {
    logout: mockLogout,
  };

  const defaultSocketContext = {
    me: "user123",
    name: "Test User",
    setName: mockSetName,
    onlineUsers: [],
    callUser: mockCallUser,
    isInGroupChat: false,
    joinActiveListAs: mockJoinActiveListAs,
    leaveActiveList: mockLeaveActiveList,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the basic structure correctly", () => {
    const { container } = renderWithContexts(
      defaultAuthContext,
      defaultSocketContext
    );

    expect(container.firstChild).toHaveClass(
      "w-[400px]",
      "border-r",
      "bg-slate-100"
    );
    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.getByTestId("signout-icon")).toBeInTheDocument();
  });

  it("handles logout button click", () => {
    renderWithContexts(defaultAuthContext, defaultSocketContext);

    const logoutButton = screen.getByText("Log Out").closest("button");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("displays and updates user name input", () => {
    renderWithContexts(defaultAuthContext, defaultSocketContext);

    const nameInput = screen.getByPlaceholderText("name...");
    expect(nameInput).toHaveValue("Test User");

    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(mockSetName).toHaveBeenCalledWith("New Name");
  });

  it("shows Join Group Chat button when not in group chat", () => {
    renderWithContexts(defaultAuthContext, defaultSocketContext);

    const joinButton = screen.getByText("Join Group Chat");
    expect(joinButton).toBeInTheDocument();

    fireEvent.click(joinButton);
    expect(mockJoinActiveListAs).toHaveBeenCalledWith("Test User");
  });

  it("shows Leave Group Chat button when in group chat", () => {
    const socketContextWithGroup = {
      ...defaultSocketContext,
      isInGroupChat: true,
    };

    renderWithContexts(defaultAuthContext, socketContextWithGroup);

    const leaveButton = screen.getByText("Leave Group Chat");
    expect(leaveButton).toBeInTheDocument();

    fireEvent.click(leaveButton);
    expect(mockLeaveActiveList).toHaveBeenCalledWith("user123");
    expect(mockSetName).toHaveBeenCalledWith("");
  });

  it("renders list of online users with call buttons", () => {
    const socketContextWithUsers = {
      ...defaultSocketContext,
      onlineUsers: [
        { id: "user1", username: "John" },
        { id: "user2", username: "Jane" },
      ],
    };

    renderWithContexts(defaultAuthContext, socketContextWithUsers);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();

    const callButtons = screen.getAllByText("Call");
    expect(callButtons).toHaveLength(2);

    fireEvent.click(callButtons[0]);
    expect(mockCallUser).toHaveBeenCalledWith("user1");
  });

  it("handles empty online users list", () => {
    renderWithContexts(defaultAuthContext, defaultSocketContext);

    expect(screen.getByText("Active Users:")).toBeInTheDocument();
    expect(screen.queryByText("Call")).not.toBeInTheDocument();
  });

  describe("Styling and UI Elements", () => {
    it("verifies button styling classes", () => {
      renderWithContexts(defaultAuthContext, defaultSocketContext);

      const logoutButton = screen.getByText("Log Out").closest("button");
      expect(logoutButton).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "gap-2",
        "px-4",
        "py-2",
        "transition-colors",
        "rounded-lg",
        "bg-slate-200",
        "hover:bg-slate-100",
        "hover:text-red-600",
        "group"
      );

      const joinButton = screen.getByText("Join Group Chat");
      expect(joinButton).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "gap-2",
        "px-4",
        "py-2",
        "text-white",
        "transition-colors",
        "bg-blue-500",
        "rounded-md",
        "hover:bg-blue-600"
      );
    });

    it("verifies input field styling", () => {
      renderWithContexts(defaultAuthContext, defaultSocketContext);

      const nameInput = screen.getByPlaceholderText("name...");
      expect(nameInput).toHaveClass(
        "w-full",
        "px-4",
        "py-2",
        "border",
        "border-gray-300",
        "rounded-md",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles missing context values gracefully", () => {
      const minimalContexts = {
        auth: { logout: mockLogout },
        socket: { me: "", name: "", onlineUsers: [] },
      };

      expect(() =>
        renderWithContexts(minimalContexts.auth, minimalContexts.socket)
      ).not.toThrow();
    });

    it("handles null or undefined online users", () => {
      const contextWithNullUsers = {
        ...defaultSocketContext,
        onlineUsers: null,
      };

      renderWithContexts(defaultAuthContext, contextWithNullUsers);
      expect(screen.getByText("Active Users:")).toBeInTheDocument();
    });
  });
});
