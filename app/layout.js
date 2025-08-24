import { Lora, Raleway, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const space = Space_Mono({
  weight: "400",
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShipNotes - Transform GitHub Commits into Beautiful Release Notes",
  description: "Automatically generate professional, customer-friendly release notes from your GitHub commits in under 30 seconds. Perfect for indie SaaS developers and small teams.",
  keywords: [
    "release notes",
    "changelog",
    "github commits",
    "saas tools",
    "developer tools",
    "automated release notes",
    "customer communication",
    "product updates"
  ],
  authors: [{ name: "ShipNotes" }],
  creator: "ShipNotes",
  publisher: "ShipNotes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shipnotes.dev"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "ShipNotes - Transform GitHub Commits into Beautiful Release Notes",
    description: "Automatically generate professional, customer-friendly release notes from your GitHub commits in under 30 seconds. Perfect for indie SaaS developers and small teams.",
    url: "https://shipnotes.dev",
    siteName: "ShipNotes",
    images: [
      {
        url: "/link-image.png",
        width: 1200,
        height: 630,
        alt: "ShipNotes - Transform GitHub Commits into Beautiful Release Notes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipNotes - Transform GitHub Commits into Beautiful Release Notes",
    description: "Automatically generate professional, customer-friendly release notes from your GitHub commits in under 30 seconds.",
    images: ["/link-image.png"],
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

export default function RootLayout({ children }) {
  return (
    <html data-theme="mytheme" lang="en" className="scroll-smooth">
      <body
        className={`${lora.variable} ${raleway.variable} ${space.variable} antialiased`}
      >
        {children}

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={true}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-lora)",
            },
          }}
        />

        {/* ShipNotes.dev Widget */}
        <script
          src="https://shipnotes.dev/widget.js"
          data-shipnotes-project="shipnotes"
          data-position="bottom-right"
          data-theme="light"
          data-show-count="true"
          data-days="30"
          async
        ></script>
      </body>
    </html>
  );
}
