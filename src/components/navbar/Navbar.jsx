import "./Navbar.css";
import { Link } from "react-router-dom";

import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";

import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="navbar">
            <div className="title">
                <h1><span>RU</span></h1>
            </div>

            <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            </div>

            <div className={`buttons ${menuOpen ? "open" : ""}`}>
                <Link to="/" onClick={() => setMenuOpen(false)} className="buttons-link">Home</Link>
                <Link to="/submit" onClick={() => setMenuOpen(false)} className="buttons-link">Submit</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="buttons-link">Profile</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="buttons-link">About</Link>

                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Light or Dark Mode">
                    {theme === "light" ? <MdLightMode /> : <MdDarkMode />}
                </button>

                <a href="https://github.com/chexedy/rutgerswaterfountains" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                </a>
            </div>
        </div>
    );
}