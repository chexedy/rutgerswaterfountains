import "./Fountain.css";
import { FaBottleWater } from "react-icons/fa6";
import { TbFountain } from "react-icons/tb";

export default function Fountain({ hasBottleReFill, theme }) {
    const bgColor = hasBottleReFill
        ? "rgb(50,205,50)"
        : "var(--primary-color)";

    return (
        <div className="marker" style={{ backgroundColor: bgColor }}>
            {hasBottleReFill === true ? <FaBottleWater style={{ color: "white" }} /> : <TbFountain style={{ color: "white" }} />}
        </div>
    );
}