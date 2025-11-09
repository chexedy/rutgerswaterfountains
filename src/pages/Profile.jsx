import "./Profile.css";

import { useState, useEffect } from "react";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { SignOut } from "../components";
import { Card } from "../components"

import { useAuth } from "../context/AuthContext";
import { SQLtoLocalTime } from "../util/time";

export default function Profile() {
    const { user, token } = useAuth();

    const [openApproved, setApprovedOpen] = useState(() => {
        const stored = localStorage.getItem("openApproved");
        return stored ? stored === "true" : true;
    });

    useEffect(() => {
        localStorage.setItem("openApproved", openApproved);
    }, [openApproved]);
    const toggleApproved = () => setApprovedOpen(prev => !prev);

    const [openSubmitted, setSubmittedOpen] = useState(() => {
        const stored = localStorage.getItem("openSubmitted");
        return stored ? stored === "true" : true;
    });

    useEffect(() => {
        localStorage.setItem("openSubmitted", openSubmitted);
    }, [openApproved]);
    const toggleSubmitted = () => setSubmittedOpen(prev => !prev);

    const [approvedRequests, setApprovedRequests] = useState([]);
    useEffect(() => {
        async function updateApprovedRequests() {
            if (token) {
                const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/approved", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error("Failed to fetch approved requests");
                    return;
                }

                const data = await response.json();
                setApprovedRequests(data.results);
            }
        }
        updateApprovedRequests();
    }, [token]);

    const [submittedRequests, setSubmittedRequests] = useState([]);
    useEffect(() => {
        async function updateSubmittedRequests() {
            if (token) {
                const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/submitted", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error("Failed to fetch submitted requests");
                    return;
                }

                const data = await response.json();
                setSubmittedRequests(data.results);
            }
        }
        updateSubmittedRequests();
    }, [token]);

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
                        <button className="profile-title-toggle-button" onClick={toggleApproved}>
                            {openApproved ? "Hide" : "Show"}
                        </button>

                        {openApproved && (
                            <div>
                                <h3 className="header-three profile-header-three" id="no-approved-requests" style={{ display: approvedRequests.length === 0 ? "block" : "none" }}>You have no approved requests :(</h3>
                                <div className="card-list">
                                    {approvedRequests.map(request => (
                                        <Card
                                            id={request.id}
                                            type={request.fountain_type}
                                            campus={request.campus}
                                            time={request.time_approved}
                                            description={request.description}
                                            longitude={request.longitude}
                                            latitude={request.latitude}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <h2 className="header-two profile-header-two">Pending Requests</h2>

                        <button className="profile-title-toggle-button" onClick={toggleSubmitted}>
                            {openSubmitted ? "Hide" : "Show"}
                        </button>

                        {openSubmitted && (
                            <div>
                                <h3 className="header-three profile-header-three" id="no-pending-requests" style={{ display: submittedRequests.length === 0 ? "block" : "none" }}>You have no currently pending requests.</h3>
                                <div className="card-list">
                                    {submittedRequests.map(request => (
                                        <Card
                                            id={request.id}
                                            type={request.fountain_type}
                                            campus={request.campus}
                                            time={request.time_submitted}
                                            description={request.description}
                                            longitude={request.longitude}
                                            latitude={request.latitude}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <h3 className="header-three profile-header-three">Joined: {SQLtoLocalTime(user.join_date)}</h3>

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