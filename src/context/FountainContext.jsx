import { createContext, useContext, useState } from "react";

const FountainContext = createContext();

export function FountainProvider({ children }) {
    const [fountains, setFountains] = useState([]);

    return (
        <FountainContext.Provider value={{ fountains, setFountains }}>
            {children}
        </FountainContext.Provider>
    );
}

export const useFountains = () => useContext(FountainContext);
