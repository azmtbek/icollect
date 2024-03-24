import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { type Locale, i18n } from "@/i18n-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "iCollect",
  description: "i Collect, a personal collection app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Locale; };
}) {
  return (
    <html lang={params.lang}>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <Header lang={params.lang} />
            {children}
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
