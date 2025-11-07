import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("googleToken");
        if (savedToken) {
            const decoded = jwtDecode(savedToken);
            setUser({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
            });
            setToken(savedToken);
        }
    }, []);

    const signIn = (credentialResponse) => {
        const jwt = credentialResponse.credential;
        const decoded = jwtDecode(jwt);

        setUser({
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
        });
        setToken(jwt);
        localStorage.setItem("googleToken", jwt);
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("googleToken");
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}