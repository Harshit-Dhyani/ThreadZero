import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal-frame";
import { PortalProvider } from "@/components/portal-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThreadZero",
  description: "Independent ThreadZero concept using demo data. Nothing is sent to the government."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <PortalProvider>
          <PortalFrame>{children}</PortalFrame>
        </PortalProvider>
      </body>
    </html>
  );
}
