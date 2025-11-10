import "./Card.css";
import { SQLtoLocalTime } from "../../util/time.js";

export default function Card({ id, type, campus, time, description, longitude, latitude }) {
    const ViewOnMap = () => {
        window.location.href = "/?viewMode&latitude=" + latitude + "&longitude=" + longitude + "&type=" + type;
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
                    <span className="value">{type}</span>
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