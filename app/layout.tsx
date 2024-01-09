import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import QueryContext from "./context/QueryContext";
import Loading from "./components/Loading";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger",
  description: "Created by NQT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <Loading />
          <ToasterContext />
          <QueryContext>{children}</QueryContext>
        </AuthContext>
      </body>
    </html>
  );
}
