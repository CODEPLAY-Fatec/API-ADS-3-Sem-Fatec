"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
            <Navbar onToggleSidebar={setIsExpanded} />
            <main
                style={{
                    flexGrow: 1,
                    marginLeft: !isMobile && isExpanded ? "255px" : !isMobile ? "140px" : "0",
                    marginTop: isMobile ? "70px" : "0", 
                    padding: "1rem",
                    transition: "margin 0.3s ease",
                }}
            >
                {children}
            </main>
        </div>
    );
}
