import "./Profile.css";

import { Navbar } from "../components";
import { SignIn } from "../components";

export default function Profile() {
    return (
        <div>
            <Navbar />
            <div className="profile">
                <h1 className="header-one">Profile</h1>

                <div className="google-login">
                    <SignIn />
                </div>
            </div>
        </div>
    )
}