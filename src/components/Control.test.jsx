/* eslint-disable no-undef */
// Control.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { SocketContext } from "../SocketContext";
import Control from "./Control";

describe("Control Component", () => {
  // Helper function to render with context
  const renderWithContext = (contextValue) => {
    return render(
      <SocketContext.Provider value={contextValue}>
        <Control />
      </SocketContext.Provider>
    );
  };

  // Mock functions
  const mockAnswerCall = vi.fn();
  const mockLeaveCall = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty control panel when no call is incoming or active", () => {
    const contextValue = {
      call: { isReceivingCall: false },
      callAccepted: false,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    const { container } = renderWithContext(contextValue);

    expect(screen.queryByText(/is calling/)).not.toBeInTheDocument();
    expect(screen.queryByText("Answer")).not.toBeInTheDocument();
    expect(screen.queryByText("HANG UP")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "p-10",
      "border-t",
      "bg-slate-100"
    );
  });

  it("shows incoming call notification with answer button", () => {
    const contextValue = {
      call: {
        isReceivingCall: true,
        name: "John Doe",
      },
      callAccepted: false,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("is calling")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Answer" })).toBeInTheDocument();

    const notificationDiv = screen.getByText(/is calling/).closest("div");
    expect(notificationDiv).toHaveClass(
      "flex",
      "items-center",
      "justify-around",
      "p-4",
      "space-x-4",
      "bg-blue-50/80",
      "rounded-lg",
      "animate-[pulse_3s_ease-in-out_infinite]"
    );
  });

  it("shows hang up button during active call", () => {
    const contextValue = {
      call: { isReceivingCall: false },
      callAccepted: true,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    const hangupButton = screen.getByRole("button", { name: "HANG UP" });
    expect(hangupButton).toBeInTheDocument();
    expect(hangupButton).toHaveClass(
      "px-4",
      "py-2",
      "text-white",
      "transition-colors",
      "bg-red-500",
      "rounded-md",
      "hover:bg-red-600"
    );
  });

  it("hides hang up button when call is ended", () => {
    const contextValue = {
      call: { isReceivingCall: false },
      callAccepted: true,
      callEnded: true,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    expect(screen.queryByText("HANG UP")).not.toBeInTheDocument();
  });

  it("calls answerCall function when answer button is clicked", () => {
    const contextValue = {
      call: {
        isReceivingCall: true,
        name: "John Doe",
      },
      callAccepted: false,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    const answerButton = screen.getByRole("button", { name: "Answer" });
    fireEvent.click(answerButton);

    expect(mockAnswerCall).toHaveBeenCalledTimes(1);
  });

  it("calls leaveCall function when hang up button is clicked", () => {
    const contextValue = {
      call: { isReceivingCall: false },
      callAccepted: true,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    const hangupButton = screen.getByRole("button", { name: "HANG UP" });
    fireEvent.click(hangupButton);

    expect(mockLeaveCall).toHaveBeenCalledTimes(1);
  });

  it("handles missing caller name gracefully", () => {
    const contextValue = {
      call: {
        isReceivingCall: true,
        name: undefined,
      },
      callAccepted: false,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    expect(screen.getByText("is calling")).toBeInTheDocument();
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });

  it("verifies answer button styling", () => {
    const contextValue = {
      call: {
        isReceivingCall: true,
        name: "John Doe",
      },
      callAccepted: false,
      callEnded: false,
      answerCall: mockAnswerCall,
      leaveCall: mockLeaveCall,
    };

    renderWithContext(contextValue);

    const answerButton = screen.getByRole("button", { name: "Answer" });
    expect(answerButton).toHaveClass(
      "px-4",
      "py-2",
      "text-white",
      "transition-all",
      "duration-300",
      "bg-blue-500",
      "rounded-md",
      "hover:bg-blue-600",
      "hover:shadow-md",
      "hover:scale-102"
    );
  });
});
