import "./Card.css";
import { SQLtoLocalTime } from "../../util/time.js";

export default function Card({ id, fountain_type, campus, time, description, longitude, latitude }) {
    const ViewOnMap = () => {
        window.location.href = "/?viewMode&latitude=" + latitude + "&longitude=" + longitude + "&type=" + fountain_type;
    }

    return (
        <div className="table-card">
            <div className="table-left">
                <div className="field">
                    <span className="label">ID</span>
                    <span className="value">{id}</span>
                </div>
                <div className="field">
                    <span className="label">Type</span>
                    <span className="value">{fountain_type === "drink" ? "Drinking Only" : "Drinking + Bottle Refill"}</span>
                </div>
                <div className="field">
                    <span className="label">Campus</span>
                    <span className="value">{campus}</span>
                </div>
            </div>

            <div className="table-right">
                <span className="label">Description</span>
                <p className="value">{description}</p>

                <div className="field">
                    <span className="label">Time</span>
                    <span className="value">{SQLtoLocalTime(time)}</span>
                </div>
            </div>

            <button className="table-button" onClick={ViewOnMap}>
                View on Map
            </button>
        </div>
    )
}