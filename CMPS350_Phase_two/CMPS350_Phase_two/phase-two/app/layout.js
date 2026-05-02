import "./globals.css";

export const metadata = {
    title: "AR square",
    description: "Social-Media Platform"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}