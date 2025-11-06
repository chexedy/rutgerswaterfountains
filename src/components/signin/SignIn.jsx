import "./SignIn.css";
import { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

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

    return (
        <div>
            <h2 className="header-two">{message}</h2>
            <div className="google-login">
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        const jwt = credentialResponse.credential;
                        const decoded = jwtDecode(jwt);
                        const email = decoded.email;

                        if (email.endsWith("@scarletmail.rutgers.edu")) {
                            setMessage("Invalid email. Please sign in with your ScarletMail (netid@scarletmail.rutgers.edu).");
                            googleLogout();
                            return;
                        }

                        setToken(jwt);
                        setUser({
                            email: decoded.email,
                            name: decoded.name,
                            picture: decoded.picture,
                        });
                    }}
                    onError={() => {
                        setMessage("Error signing in. Please try again and contact me on GitHub if the error persists.");
                    }}
                    size="large"
                    shape="square"
                    width={width}
                    theme={theme === "light" ? "filled_black" : "outline"}
                    auto_select={true}
                />
            </div>
        </div>
    );
}