import { Inter, Noto_Sans_Thai, Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
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

export const metadata = {
  title: "Document Generator",
  description: "สร้างและจัดการเอกสารจากเทมเพลต",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${inter.variable} ${notoSansThai.variable} ${notoSansThaiLooped.variable} font-sans bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
