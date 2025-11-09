import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SecurityProvider } from "@/components/security/page-security";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Preloader } from "@/components/preloader";
import { ToastProvider } from "@/components/ui/toast-provider";
import { FormValidationHandler } from "@/components/ui/form-validation-handler";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MobileRedirect } from "@/components/mobile-redirect";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "SKYBER - Protect. Build. Evolve.",
  description: "SKYBER is a security-minded studio crafting resilient digital products. From idea to launch, we embed privacy, performance and maintainability into every decision.",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#17D492" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <MobileRedirect />
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <FormValidationHandler />
            <Preloader />
            <SecurityProvider>
              <div className="flex min-h-screen flex-col">
                <ConditionalLayout>{children}</ConditionalLayout>
              </div>
            </SecurityProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
