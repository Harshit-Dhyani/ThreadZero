import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal-frame";
import { PortalProvider } from "@/components/portal-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Cyber Fraud Reporting Guide",
  description: "Independent ThreadZero concept using deterministic synthetic data."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PortalProvider>
          <PortalFrame>{children}</PortalFrame>
        </PortalProvider>
      </body>
    </html>
  );
}
