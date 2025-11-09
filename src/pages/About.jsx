import "./About.css";
import { Navbar } from "../components";

export default function About() {
    return (
        <div>
            <Navbar />
            <div className="about">
                <h1 className="header-one">About</h1>
                <h2 className="about-description">I live on the water fountains on campus as water is overpriced everywhere, so I decided to make a map that could hopefully help others find them as well.</h2>

                <h1 className="header-one">FAQ</h1>
                <div className="faq-list">
                    <div className="faq-element">
                        <h2 className="faq-question">How long does it take for my submission to get approved?</h2>
                        <h3 className="faq-answer">I'll try to verify and add it ASAP.</h3>
                    </div>
                    <div className="faq-element">
                        <h2 className="faq-question">What data do you collect?</h2>
                        <h3 className="faq-answer">I only store your NetID. Since it is unique for every student, I use it as an identifier so I know who submitted what and also to prevent a single user from spamming requests.</h3>
                    </div>
                    <div className="faq-element">
                        <h2 className="faq-question">There's a bug with the site...</h2>
                        <h3 className="faq-answer">Make an issue on GitHub, try to be as detailed as possible as it will help me recreate it. If you have no idea what GitHub is, message me on Discord instead (@chexedy)</h3>
                    </div>
                </div>

                <h2 className="about-description">Special thanks to the dude at RU Facilities who uploaded the data on all the building outlines and their names for public use.</h2>
            </div>
        </div>
    )
}