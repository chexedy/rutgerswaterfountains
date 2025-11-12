import "./Fountain.css";
import { FaBottleWater } from "react-icons/fa6";
import { TbFountain } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";

export default function Fountain({ hasBottleReFill, isPreview }) {
    let bgColor = hasBottleReFill
        ? "rgb(99,149,238)"
        : "rgb(128,239,128)";

    if (isPreview) {
        bgColor = "var(--primary-color)";
    }

    return (
        <div className="marker" style={{ backgroundColor: bgColor }}>
            {isPreview ? (
                <FaLocationDot style={{ color: "white" }} />
            ) : hasBottleReFill ? (
                <FaBottleWater style={{ color: "white" }} />
            ) : (
                <TbFountain style={{ color: "white" }} />
            )}
        </div>
    );
}