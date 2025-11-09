import "./SignOut.css";

import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

export default function SignOut() {
    const { signOut } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("join_date");
        googleLogout();
        signOut();
    }

    return (
        <button className="logout-button" onClick={handleLogout}>
            Log Out
        </button>
    )
}