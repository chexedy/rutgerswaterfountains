import "./Profile.css";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="profile">
                <h1 className="header-one">Profile</h1>

                {user ? (
                    <div>
                        <h1 className="header-three">Hi, {user.name.split[0]}!</h1>
                    </div>
                ) : (
                    <div className="google-login">
                        <SignIn />
                    </div>
                )}
            </div>
        </div>
    )
}