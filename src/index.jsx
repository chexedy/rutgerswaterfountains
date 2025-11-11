import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import { FountainProvider } from "./context/FountainContext.jsx";

import App from "./App.jsx";
import "./index.css";

const CLIENT_ID = "1035191883685-4iqip4ig8a7rc5je4cttde5he9n26v4r.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <FountainProvider>
              <App />
            </FountainProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);