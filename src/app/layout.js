import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Dev Jobs",
    template: "%s | Dev Jobs",
  },
  description: "Find your dream jobs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-w-[350px]`}>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" />
        <my-widget project-id="3"></my-widget>
      </body>
      <Script src="https://feedback-popup-widget.vercel.app/widget.umd.js" />
    </html>
  );
}
