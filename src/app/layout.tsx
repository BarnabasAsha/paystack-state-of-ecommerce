import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Paystack - State of Ecommerce Report",
  description: "The comprehensive review on the state of ecommerce in Africa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
