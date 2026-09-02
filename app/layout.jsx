import { Inter, Noto_Sans, Noto_Sans_Thai, Noto_Sans_Thai_Looped, Sarabun } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  variable: "--font-noto-thai-looped",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "DocBuilder Workspace | Crest Zendo",
  description: "ระบบสร้างและจัดการเอกสารสัญญาและใบเสนอราคาสำหรับธุรกิจ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning className="h-full">
      <body className={`${inter.variable} ${notoSans.variable} ${notoSansThai.variable} ${notoSansThaiLooped.variable} ${sarabun.variable} font-sans bg-background text-foreground antialiased min-h-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
