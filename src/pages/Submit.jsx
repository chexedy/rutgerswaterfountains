import "./Submit.css";
import { useState, useEffect } from "react";

import { Navbar } from "../components";
import { SignIn } from "../components";

import { useAuth } from "../context/AuthContext";
import { useFountains } from "../context/FountainContext.jsx";

export default function Submit() {
    const { fountains, setFountains } = useFountains();
    const { user, token } = useAuth();

    const [isEdit, setIsEdit] = useState(() => {
        const saved = localStorage.getItem("isEdit");
        return saved ? JSON.parse(saved) : false;
    });

    const [editId, setEditId] = useState(() => {
        const saved = localStorage.getItem("editId");
        return saved ? parseInt(saved) : null;
    });

    const [originalFountain, setOriginalFountain] = useState(null);

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("currentSubmission");
        const savedCoords = localStorage.getItem("coordinates");
        return {
            fountain_type: saved ? JSON.parse(saved).fountain_type : "drink",
            campus: saved ? JSON.parse(saved).campus : "College Avenue",
            description: saved ? JSON.parse(saved).description : "",
            longitude: savedCoords ? JSON.parse(savedCoords).longitude : "",
            latitude: savedCoords ? JSON.parse(savedCoords).latitude : "",
            target_fountain_id: isEdit ? editId : null
        };
    });

    useEffect(() => {
        async function fountainsEffect() {
            const params = new URLSearchParams(window.location.search);
            const urlEditId = params.has("editId") ? parseInt(params.get("editId")) : null;
            const storedEditId = localStorage.getItem("editId");

            const id = urlEditId ?? (storedEditId ? parseInt(storedEditId) : null);

            if (id) {
                setEditId(id);
                setIsEdit(true);

                const fountain = fountains.find(f => f.id === id);
                if (fountain) {
                    const { fountain_type, campus, description, longitude, latitude } = fountain;
                    setFormData({
                        fountain_type: fountain.fountain_type,
                        campus: fountain.campus,
                        description: fountain.description,
                        longitude: fountain.longitude,
                        latitude: fountain.latitude,
                        target_fountain_id: id
                    });

                    setOriginalFountain({
                        fountain_type: fountain.fountain_type,
                        campus: fountain.campus,
                        description: fountain.description,
                        longitude: fountain.longitude,
                        latitude: fountain.latitude
                    });
                } else {
                    const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/fountains", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });

                    if (!response.ok) {
                        alert("Failed to fetch fountain data, try refreshing. If the error persists, contact me on Github.");
                        return;
                    }

                    const data = await response.json();
                    setFountains(data.requests);
                }
            }
        }
        fountainsEffect();
    }, [fountains]);


    useEffect(() => {
        const { fountain_type, campus, description } = formData;
        localStorage.setItem("currentSubmission", JSON.stringify({ fountain_type, campus, description }));
        const { longitude, latitude } = formData;
        localStorage.setItem("coordinates", JSON.stringify({ longitude, latitude }));
    }, [formData]);

    useEffect(() => {
        if (editId) localStorage.setItem("editId", editId);
        localStorage.setItem("isEdit", JSON.stringify(isEdit));
    }, [editId, isEdit]);

    const getLatLog = () => {
        const { longitude, latitude } = formData;
        localStorage.setItem("coordinates", JSON.stringify({ longitude, latitude }));
        window.location.href = "/?selectMode";
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submitFountain = async () => {
        if (!confirm("Are you sure you want to submit this fountain request?")) return;

        const requiredFields = ["fountain_type", "campus", "description", "longitude", "latitude"];
        for (const field of requiredFields) {
            const value = formData[field];
            if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
                alert(`Please fill in the required field: ${field}`);
                return;
            }
        }

        if (isEdit) {
            if (!editId) {
                alert("Edit ID missing — cannot submit as edit!");
                return;
            }
            const fieldsToCheck = ["fountain_type", "campus", "description", "longitude", "latitude"];
            const isUnchanged = fieldsToCheck.every(
                field => formData[field] === originalFountain[field]
            );
            if (isUnchanged) {
                alert("You haven't made any changes. Please modify at least one field before submitting an edit.");
                return;
            }
        }

        const body = {
            ...formData,
            request_type: isEdit ? "edit" : "add",
            target_fountain_id: isEdit ? editId : null
        };
        console.log("Submitting fountain with data:", formData);
        return;

        try {
            const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/submission", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed");
            }

            console.log("Submission successful, ID:", data.id);
            localStorage.removeItem("currentSubmission");
            localStorage.removeItem("coordinates");
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
                            {isEdit && (
                                <h3 className="edit-warning">
                                    ⚠️ You are editing an existing fountain. If this is incorrect, please click "Cancel Edit" to start a new submission.
                                    <button type="button" className="pick-location-button" onClick={() => {
                                        setIsEdit(false);
                                        setEditId(null);
                                        setFormData({ fountain_type: "drink", campus: "College Avenue", description: "", longitude: "", latitude: "" });
                                        localStorage.removeItem("isEdit");
                                        localStorage.removeItem("editId");
                                    }} style={{ marginTop: "1vh" }}>Cancel Edit</button>
                                </h3>
                            )}

                            <label className="submit-label" htmlFor="fountain_type">What is the Fountain Type?</label>
                            <select className="submit-select" name="fountain_type" value={formData.fountain_type} onChange={handleChange}>
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
                                Pick Location On Map
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