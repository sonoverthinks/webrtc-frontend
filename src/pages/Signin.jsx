// import { fetchWithToken } from "../utils/fetchWithToken";
import { AuthContext } from "../AuthContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const context = useContext(AuthContext);
  const { login } = context;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate input
    if (!username || !password) {
      setError("Please provide username and password");
      return;
    }

    try {
      const response = await fetch(
        "https://webrtc-backend-5rhc.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (response.ok) {
        // Login successful, store token and redirect
        localStorage.setItem("token", data.token);

        // Update auth context
        login(data.token, data.userData);

        // Redirect to home page
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Error logging in");
    }
  };
  const handleSignupClick = () => {
    navigate("/signup");
  };
  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-8">
      <div className="px-8 py-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              // required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              // required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={handleSignupClick}
              className="font-medium text-blue-600 transition-colors duration-300 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
