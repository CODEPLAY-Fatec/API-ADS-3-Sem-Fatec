"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div style={{ display: "flex" }}>
            <Navbar onToggleSidebar={setIsExpanded} />
            <main
                style={{
                    flexGrow: 1,
                    marginLeft: isExpanded ? "255px" : "140px",
                    padding: "1rem",
                    transition: "margin-left 0.3s ease",
                }}
            >
                {children}
            </main>
        </div>
    );
}
