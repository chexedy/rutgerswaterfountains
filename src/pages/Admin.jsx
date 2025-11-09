import "./Admin.css";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { AdminCard } from "../components"

export default function Admin() {
    const { user, token } = useAuth();

    const [adminRequests, setAdminRequests] = useState([]);
    useEffect(() => {
        async function fetchAdminRequests() {
            if (token) {
                const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/admin", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error("Failed to fetch admin requests");
                    return;
                }

                const data = await response.json();
                console.log(data.requests);
                setAdminRequests(data.requests || []);
            }
        }
        fetchAdminRequests();
    }, [token]);

    return (
        <div>
            <Navbar />
            <div className="admin">
                <h1 className="header-one">Admin Panel</h1>
                <h3 className="header-three"></h3>

                {user ? (
                    <div className="admin-card-list">
                        <h2 className="header-two">Pending Requests</h2>
                        {adminRequests.length > 0 ? (
                            adminRequests.map((request) => (
                                <AdminCard
                                    key={request.id}
                                    id={request.id}
                                    net_id={request.net_id}
                                    request_type={request.request_type}
                                    fountain_type={request.fountain_type}
                                    campus={request.campus}
                                    time_submitted={request.time_submitted}
                                    description={request.description}
                                    longitude={request.longitude}
                                    latitude={request.latitude}
                                    target_fountain_id={request.target_fountain_id}
                                />
                            ))
                        ) : (
                            <h3 className="header-three">You do not have admin access.</h3>
                        )}
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