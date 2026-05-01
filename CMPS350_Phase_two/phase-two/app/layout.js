import "./styles.css";

export const metadata = {
    title: "AR square",
    description: "Social-Media Platform"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}