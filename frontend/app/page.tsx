import type { Metadata } from "next";
import HomePageClient from "./home-client";

export const metadata: Metadata = {
  title: "Lord AC — Authorized Carrier & Midea Dealer",
  description:
    "Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986. Shop split ACs, multi-split systems, central units, and get professional installation, maintenance, and repair services.",
};

export default function HomePage() {
  return <HomePageClient />;
}
