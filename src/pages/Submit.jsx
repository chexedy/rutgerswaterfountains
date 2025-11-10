import "./Submit.css";

import { useState, useEffect } from "react";

import { Navbar } from "../components";
import { SignIn } from "../components";
import { useAuth } from "../context/AuthContext";

export default function Submit() {
    const { user, token } = useAuth();

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("currentSubmission");
        console.log("Initializing form data from localStorage:", saved);
        return saved
            ? JSON.parse(saved)
            : {
                type: "drink",
                campus: "College Avenue",
                description: "",
                longitude: "",
                latitude: "",
            };
    });

    useEffect(() => {
        const saved = localStorage.getItem("currentSubmission");
        if (saved) {
            const parsed = JSON.parse(saved);
            setFormData((prev) => ({
                ...prev,
                ...parsed,
            }));
            console.log("Merged saved submission data from localStorage.");
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("currentSubmission", JSON.stringify(formData));
    }, [formData]);

    const getLatLog = () => {
        localStorage.setItem("currentSubmission", JSON.stringify(formData));
        window.location.href = "/?selectMode";
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Updating form field ${name} to value: ${value}`);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null)

    const submitFountain = async () => {
        if (!confirm("Are you sure you want to submit this fountain request?")) return;

        const requiredFields = ["type", "campus", "description", "longitude", "latitude"];
        console.log(formData);
        for (const field of requiredFields) {
            const value = formData[field];
            if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
                alert(`Please fill in the required field: ${field}`);
                return;
            }
        }

        if (isEdit) {
            if (!editId) {
                alert("Cannot submit edit: missing edit ID.");
                return;
            } else {
                formData.append("request_type", "edit");
                formData.append("target_fountain_id", editId);
            }
        } else {
            formData.request_type = "new";
        }

        console.log("Submitting fountain with data:", formData);

        try {
            const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/submission", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    request_type: isEdit ? "edit" : "add",
                    target_fountain_id: isEdit ? editId : null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed");
            }

            console.log("Submission successful, ID:", data.id);
            localStorage.removeItem("currentSubmission");
            setFormData({ type: "", campus: "", description: "", longitude: "", latitude: "" });
            document.querySelector(".submit-header-response").innerText = `Submission successful! Your submission ID is ${data.id}.`;
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    return (
        <div>
            <Navbar />
            <div className="submit">
                <h1 className="header-one submit-header-one">A Fountain</h1>

                {user ? (
                    <div>
                        <h3 className="header-three submit-header-three">Please make sure all information is correct, and that there are no spelling mistakes or grammatical errors. Thank you!</h3>
                        <form className="submit-form">
                            <label className="submit-label" htmlFor="type">What is the Fountain Type?</label>
                            <select className="submit-select" name="type" value={formData.type} onChange={handleChange}>
                                <option className="submit-option" value="drink">Drinking Only</option>
                                <option className="submit-option" value="refill">Drinking + Bottle Refill</option>
                            </select>

                            <label className="submit-label" htmlFor="campus">Which Campus is it found on?</label>
                            <select className="submit-select" name="campus" value={formData.campus} onChange={handleChange}>
                                <option className="submit-option" value="College Avenue">College Ave</option>
                                <option className="submit-option" value="Livingston">Livingston</option>
                                <option className="submit-option" value="Busch">Busch</option>
                                <option className="submit-option" value="Cook/Douglass">Cook/Douglass</option>
                            </select>

                            <label className="submit-label" htmlFor="description" autoComplete="off">Fountain Description</label>
                            <h4>Briefly describe where the fountain is located. Include any nearby signs or buildings as a reference (max 150 characters).</h4>
                            <input
                                className="submit-select"
                                name="description"
                                type="text"
                                maxLength="150"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <label className="submit-label" htmlFor="location">Location</label>
                            <button
                                type="button"
                                className="pick-location-button"
                                onClick={getLatLog}
                            >
                                Pick Location on Map
                            </button>
                            <input
                                autoComplete="off"
                                className="submit-select"
                                name="longitude"
                                type="number"
                                maxLength="20"
                                placeholder="Longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                            />
                            <input
                                autoComplete="off"
                                className="submit-select"
                                name="latitude"
                                type="number"
                                maxLength="20"
                                placeholder="Latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                            />
                        </form>

                        <button className="submit-fountain" onClick={submitFountain}>
                            Submit Fountain
                        </button>

                        <h3 className="header-three submit-header-response"></h3>
                    </div>
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