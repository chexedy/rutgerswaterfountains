import "./Navbar.css"
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";

export default function Navbar() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    });

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

    return (
        <div className="navbar">
            <div className="title">
                <h1>
                    <span>RU</span>
                </h1>
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

                <a href="https://github.com/chexedy/rutgerswaterfountains" target="_blank" rel="noopener noreferrer" aria-label="Open the website's GitHub Repository">
                    <FaGithub />
                </a>
            </div>
        </div>
    );
}
