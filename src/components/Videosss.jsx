// /* eslint-disable no-undef */
// // Video.test.jsx
// import React from "react";
// import { render, fireEvent } from "@testing-library/react";
// import Video from "./Video";
// import { vi } from "vitest";

// describe("Video", () => {
//   it("renders video element", () => {
//     const user = "John Doe";
//     const videoRef = { current: {} };
//     const { getByTagName } = render(<Video user={user} video={videoRef} />);

//     expect(getByTagName("video")).toBeInTheDocument();
//   });

//   it("renders user name", () => {
//     const user = "John Doe";
//     const videoRef = { current: {} };
//     const { getByText } = render(<Video user={user} video={videoRef} />);

//     expect(getByText(user)).toBeInTheDocument();
//   });

//   it("has correct video attributes", () => {
//     const user = "John Doe";
//     const videoRef = { current: {} };
//     const { getByTagName } = render(<Video user={user} video={videoRef} />);

//     const videoElement = getByTagName("video");
//     expect(videoElement).toHaveAttribute("playsInline", "");
//     expect(videoElement).toHaveAttribute("muted", "");
//     expect(videoElement).toHaveAttribute("autoPlay", "");
//   });

//   it("has correct video className", () => {
//     const user = "John Doe";
//     const videoRef = { current: {} };
//     const { getByTagName } = render(<Video user={user} video={videoRef} />);

//     const videoElement = getByTagName("video");
//     expect(videoElement).toHaveClass("object-cover", "w-full", "h-full");
//   });

//   it("has correct user container className", () => {
//     const user = "John Doe";
//     const videoRef = { current: {} };
//     const { getByText } = render(<Video user={user} video={videoRef} />);

//     const userContainer = getByText(user).parentElement;
//     expect(userContainer).toHaveClass(
//       "absolute",
//       "px-2",
//       "py-1",
//       "text-sm",
//       "bg-white",
//       "rounded-lg",
//       "shadow-lg",
//       "bottom-2",
//       "left-2"
//     );
//   });
// });
