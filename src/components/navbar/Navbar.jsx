import { Link } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
    return (
        <nav className="absolute top-0 left-0 w-full bg-white/40 backdrop-blur-md border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-semibold text-black-700 drop-shadow-sm">
                        RU Water Fountains
                    </Link>

                    <div className="flex space-x-6">
                        <Link
                            to="/"
                            className="text-gray-900 hover:text-blue-700 font-medium transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/submit"
                            className="text-gray-900 hover:text-blue-700 font-medium transition"
                        >
                            Submit
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-900 hover:text-blue-700 font-medium transition"
                        >
                            About
                        </Link>
                        <Link
                            to="/profile"
                            className="text-gray-900 hover:text-blue-700 font-medium transition"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
