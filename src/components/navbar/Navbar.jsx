import "./Navbar.css";
import { Link } from "react-router-dom";

import { MdLightMode, MdDarkMode } from "react-icons/md";

import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="navbar">
            <div className="navbar-title">
                <h1><span>RU</span></h1>
            </div>

            <div className="navbar-hamburger" onClick={() => setMenuOpen(prev => !prev)}>
                <div className={`navbar-bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`navbar-bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`navbar-bar ${menuOpen ? "open" : ""}`}></div>
            </div>

            <div className={`navbar-buttons ${menuOpen ? "open" : ""}`}>
                <Link to="/" onClick={() => setMenuOpen(false)} className="navbar-buttons-link">Home</Link>
                <Link to="/submit" onClick={() => setMenuOpen(false)} className="navbar-buttons-link">Submit</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="navbar-buttons-link">Profile</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="navbar-buttons-link">About</Link>

                <button className="navbar-theme-toggle" onClick={toggleTheme} aria-label="Toggle Light or Dark Mode">
                    {theme === "light" ? <MdLightMode /> : <MdDarkMode />}
                </button>
            </div>
        </div>
    );
}