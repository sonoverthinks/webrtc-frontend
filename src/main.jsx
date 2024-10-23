import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import { MyProvider } from "./MyContext.jsx";
// import { SocketContextProvider } from "./SocketContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <SocketContextProvider> */}
    <App />
    {/* </SocketContextProvider> */}
  </StrictMode>
);
