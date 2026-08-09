import { Playfair_Display, Inter, Noto_Serif_Georgian, Noto_Sans_Georgian } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-noto-serif-ka",
  display: "swap",
});

export const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-ka",
  display: "swap",
});

export const fontVariables = `${playfairDisplay.variable} ${inter.variable} ${notoSerifGeorgian.variable} ${notoSansGeorgian.variable}`;
