import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { JsonLd } from "@/components/seo/JsonLd";

// ... existing imports

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://solarmind.com"),
  title: {
    default: "SolarMind | Future Energy Solutions",
    template: "%s | SolarMind",
  },
  description: "Premium solar panels, batteries, and accessories for the modern home. AI-powered sizing and direct-to-consumer pricing.",
  keywords: ["solar panels", "inverters", "batteries", "home energy", "solar kits", "AI solar sizing"],
  authors: [{ name: "SolarMind Team" }],
  creator: "SolarMind",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SolarMind",
    title: "SolarMind | Future Energy Solutions",
    description: "Premium solar panels, batteries, and accessories for the modern home.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarMind | Future Energy Solutions",
    creator: "@solarmind",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://solarmind.com/#organization",
        "name": "SolarMind",
        "url": "https://solarmind.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://solarmind.com/logo.png",
          "width": 112,
          "height": 112
        },
        "sameAs": [
          "https://twitter.com/solarmind",
          "https://linkedin.com/company/solarmind"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-555-5555",
          "contactType": "customer service"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://solarmind.com/#website",
        "url": "https://solarmind.com",
        "name": "SolarMind",
        "description": "Premium commercial and residential solar hardware.",
        "publisher": {
          "@id": "https://solarmind.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://solarmind.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JsonLd data={jsonLd} />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <ChatWidget />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
