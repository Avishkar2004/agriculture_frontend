import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../actions/authContext";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const GoogleCallback = () => {
  const history = useHistory();
  const { login } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        // console.log("Token received from query params:", token);

        // Save token to local storage
        localStorage.setItem("authToken", token);

        // Decode the token to extract user information
        const user = jwtDecode(token); // Extract user information, username

        // console.log("Decoded user:", user);
        login({ token, ...user });
        history.push("/");
      } catch (error) {
        console.error("Error decoding token or login failed:", error);
      }
    } else {
      console.error("Login failed or token missing");
    }
  }, [history, login]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
