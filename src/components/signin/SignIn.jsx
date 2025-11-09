import "./SignIn.css";
import { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

async function addUser(token) {
    try {
        const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to add user:", data.error);
            return false;
        }

        return data;
    } catch (err) {
        console.error("Error calling /user:", err);
        return null;
    }
}

export default function SignIn() {
    const { theme } = useTheme();
    const { setUser, setToken } = useAuth();
    const [message, setMessage] = useState(
        "Sign in with your ScarletMail (netid@scarletmail.rutgers.edu)."
    );
    const [width, setWidth] = useState(window.innerWidth / 2);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth / 2);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSuccess = async (credentialResponse) => {
        const jwt = credentialResponse.credential;
        const decoded = jwtDecode(jwt);
        const email = decoded.email;

        if (!email.endsWith("@scarletmail.rutgers.edu")) {
            setMessage(
                "Invalid email. Please sign in with your ScarletMail (netid@scarletmail.rutgers.edu)."
            );
            googleLogout();
            return;
        }

        const response = await addUser(jwt);
        console.log(response);
        if (!response) {
            setMessage(
                "Invalid email. Please sign in with your ScarletMail (netid@scarletmail.rutgers.edu)."
            );
            googleLogout();
            return;
        }

        setToken(jwt);
        setUser({
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            join_date: response.results.join_date
        });

        localStorage.setItem("googleToken", jwt);
    };

    return (
        <div>
            <h2 className="header-two signin-header">{message}</h2>
            <div className="google-login">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                        setMessage("Error signing in. Please try again and contact me on GitHub if the error persists.");
                    }}
                    size="large"
                    shape="square"
                    width={width}
                    theme={theme === "light" ? "filled_black" : "outline"}
                />
            </div>
        </div>
    );
}