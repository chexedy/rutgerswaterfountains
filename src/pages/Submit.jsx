import "./Submit.css";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { useAuth } from "../context/AuthContext";

export default function Submit() {
    const { user } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="submit">
                <h1 className="header-one submit-header-one">A Fountain</h1>

                {user ? (
                    <h3 className="header-three submit-header-three">Please make sure all information is correct, and that there are no spelling mistakes or grammatical errors. Thank you!</h3>
                ) : (
                    <div>
                        <div className="google-login">
                            <SignIn />
                        </div>
                    </div>
                )};
            </div>
        </div>
    )
}