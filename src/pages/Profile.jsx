import "./Profile.css";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { SignOut } from "../components";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="profile">
                <h1 className="header-one profile-header-one">Profile</h1>

                {user ? (
                    <div>
                        <div className="profile-user">
                            <img src={user.picture} alt="Google Account Profile Picture"></img>
                            <h3 className="header-three">Hi, {user.name.split(" ")[0]}!</h3>
                        </div>
                        <h3 className="header-three profile-header-three">Here you can find everything regarding your requests and account.</h3>

                        <h2 className="header-two profile-header-two">Approved Requests</h2>
                        <h3 className="header-three profile-header-three" id="no-approved-requests" style={{ display: "none" }}>You have no approved requests :(</h3>

                        <div className="card-list" id="approved-requests-list">
                            <div className="table-card">
                                <div className="table-left">
                                    <div className="field">
                                        <span className="label">ID</span>
                                        <span className="value">1</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Type</span>
                                        <span className="value">Modern</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Campus</span>
                                        <span className="value">Busch</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Approved</span>
                                        <span className="value">8:00 PM</span>
                                    </div>
                                </div>

                                <div className="table-right">
                                    <span className="label">Description</span>
                                    <p className="value">
                                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                                        Aenean massa. Cum sociis natoque penatibus et magnis dis p.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="header-two profile-header-two">Pending Requests</h2>
                        <h3 className="header-three profile-header-three" id="no-pending-requests" style={{ display: "none" }}>You have no currently pending requests.</h3>

                        <div className="card-list" id="pending-requests-list">
                            <div className="table-card">
                                <div className="table-left">
                                    <div className="field">
                                        <span className="label">ID</span>
                                        <span className="value">1</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Type</span>
                                        <span className="value">Modern</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Campus</span>
                                        <span className="value">Busch</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Submitted</span>
                                        <span className="value">8:00 PM</span>
                                    </div>
                                    <div className="field">
                                        <span className="label">Editing Existing Fountain</span>
                                        <span className="value">No</span>
                                    </div>
                                </div>

                                <div className="table-right">
                                    <span className="label">Description</span>
                                    <p className="value">
                                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                                        Aenean massa. Cum sociis natoque penatibus et magnis dis p.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="header-three profile-header-three">Contributor Since: 11/6/2025</h3>

                        <div className="google-logout">
                            <SignOut />
                        </div>
                    </div>
                ) : (
                    <div className="google-login">
                        <SignIn />
                    </div>
                )}
            </div>
        </div >
    )
}