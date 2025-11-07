import "./About.css";
import { Navbar } from "../components";

export default function About() {
    return (
        <div>
            <Navbar />
            <div className="about">
                <h1 className="about-header">About</h1>
            </div>
        </div>
    )
}