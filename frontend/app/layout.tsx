import "./globals.css"; // Importação do arquivo de estilos

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                {/* Preconnects para otimizar o carregamento da fonte */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" />
            </head>
            <body
                style={{ fontFamily: "'Kumbh Sans', sans-serif" }} // Definindo Kumbh Sans como fonte principal
            >
                {children}
            </body>
        </html>
    );
}
