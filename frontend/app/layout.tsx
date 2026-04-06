import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo-var",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Lord AC",
    default: "Lord AC — Authorized Carrier & Midea Dealer",
  },
  description:
    "Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986. Shop split ACs, multi-split systems, and get professional installation, maintenance, and repair services.",
  keywords: [
    "Lord AC",
    "Carrier Egypt",
    "Midea Egypt",
    "air conditioning",
    "split AC",
    "installation",
    "maintenance",
  ],
  openGraph: {
    type: "website",
    locale: "en_EG",
    siteName: "Lord AC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-off-white text-dark-charcoal">
        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp phoneNumber="201000000000" />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Providers>
      </body>
    </html>
  );
}
