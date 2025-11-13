import "./AdminCard.css";
import { SQLtoLocalTime } from "../../util/time.js";
import { useAuth } from "../../context/AuthContext";

export default function AdminCard({ id, net_id, request_type, fountain_type, campus, time_submitted, description, longitude, latitude, target_fountain_id }) {
    const { token } = useAuth();

    const viewOnMap = () => {
        window.location.href = "/?viewModeAdmin&latitude=" + latitude + "&longitude=" + longitude;
    }

    const approveRequest = async (approved) => {
        if (!confirm(`Are you sure you want to ${approved ? "APPROVE" : "DENY"} request ${id}?`)) return;

        try {
            const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/approvesubmission", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id,
                    action: approved ? "accept" : "deny"
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update request");

            alert(data.message);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    return (
        <div className="admin-table-card">
            <div className="table-left">
                <div className="field">
                    <span className="label">ID</span>
                    <span className="value">{id}</span>
                </div>
                <div className="field">
                    <span className="label">NetID</span>
                    <span className="value">{net_id}</span>
                </div>
                <div className="field">
                    <span className="label">Request Type</span>
                    <span className="value">{request_type === "add" ? "New" : "Edit"}</span>
                </div>
                <div className="field">
                    <span className="label">Fountain Type</span>
                    <span className="value">{fountain_type === "drink" ? "Drinking Only" : "Drinking + Bottle Refill"}</span>
                </div>
                <div className="field">
                    <span className="label">Campus</span>
                    <span className="value">{campus}</span>
                </div>
            </div>

            <div className="table-right">
                <div className="field">
                    <span className="label">Time Submitted</span>
                    <span className="value">{SQLtoLocalTime(time_submitted)}</span>
                </div>

                <div className="field">
                    <span className="label">Previous ID (Edit Only)</span>
                    <span className="value">{target_fountain_id}</span>
                </div>

                <span className="label">Description</span>
                <p className="value">{description}</p>

                <button className="table-button" onClick={viewOnMap}>
                    View on Map
                </button>

                <button className="approve-button" onClick={() => approveRequest(true)}>
                    APPROVE REQUEST
                </button>
                <button className="approve-button" onClick={() => approveRequest(false)}>
                    DENY REQUEST
                </button>
            </div>
        </div>
    )
}