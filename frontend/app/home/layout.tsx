import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex" }}>
            <Navbar />
            <main style={{ flexGrow: 1, padding: "1rem" }}>{children}</main>
        </div>
    );
}
