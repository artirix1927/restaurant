import { useState, useEffect } from "react";

export const useScreenSize = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 1000);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isSmallScreen;
};