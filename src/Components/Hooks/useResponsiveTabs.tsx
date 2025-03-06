import { useState, useEffect } from "react"

export const useResponsiveTabs = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth<=768);

    useEffect(() => {
        const handleResize  = () => {
            setIsMobile(window.innerWidth<= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize",handleResize);
    },[]);
    return isMobile;

};

export default useResponsiveTabs;