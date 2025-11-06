import "./SignIn.css";

import { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';

import { useTheme } from "../../context/ThemeContext";

export default function SignIn() {
    const { theme } = useTheme();
    const [width, setWidth] = useState(window.innerWidth / 2);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth / 2);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <h2 className="header-two">Sign In with your ScarletMail (netid@scarletmail.rutgers.edu).</h2>
            <div className="google-login">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    size="large"
                    shape="square"
                    width={width}
                    theme={theme === "light" ? "filled_black" : "outline"}
                />
            </div>
        </div>
    )
}