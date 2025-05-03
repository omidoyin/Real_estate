import "../styles/tailwind.css";
import ClientProviders from "../components/Providers/ClientProviders";

export const metadata = {
  title: "Real Estate Website",
  description: "Find your dream land today",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
          <div id="portal"></div>
        </ClientProviders>
      </body>
    </html>
  );
}
