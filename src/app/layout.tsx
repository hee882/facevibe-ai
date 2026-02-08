import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaceVibe AI — 나의 얼굴 매력 점수는?",
  description:
    "AI가 분석하는 나의 매력 점수, 닮은 셀럽 Top 3, 얼굴형 분석. 사진 한 장으로 바로 확인!",
  openGraph: {
    title: "FaceVibe AI — 나의 얼굴 매력 점수는?",
    description:
      "AI가 분석하는 나의 매력 점수, 닮은 셀럽 Top 3, 얼굴형 분석.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaceVibe AI — 나의 얼굴 매력 점수는?",
    description:
      "AI가 분석하는 나의 매력 점수, 닮은 셀럽 Top 3, 얼굴형 분석.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
