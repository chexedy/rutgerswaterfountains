import "./FountainCard.css";
import { useNavigate } from "react-router-dom";
import { SQLtoLocalTime } from "../../util/time.js";

export default function FountainCard({ id, campus, latitude, longitude, fountain_type, time_approved, description, onClose }) {
    const navigate = useNavigate();

    return (
        <div className="fountain-card">
            <div className="table-left">
                <div className="field">
                    <span className="label">ID</span>
                    <span className="value">{id}</span>
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
                    <span className="value">{SQLtoLocalTime(time_approved)}</span>
                </div>

                <span className="label">Description</span>
                <p className="value">{description}</p>
            </div>

            <div className="button-row">
                <button className="approve-button close-fountain-card" onClick={onClose}>
                    Close
                </button>

                <button className="approve-button close-fountain-card" onClick={() => navigate("/submit?editId=" + id)}>
                    Request Edit
                </button>
            </div>
        </div >
    )
}   