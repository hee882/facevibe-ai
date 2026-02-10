import type { Metadata } from "next";
import Script from "next/script";
import KakaoSDK from "@/components/KakaoSDK";
import "./globals.css";

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "FaceVibe AI",
              description:
                "AI가 분석하는 나의 매력 점수, 닮은 셀럽 Top 3, 얼굴형 분석",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <KakaoSDK />
        {/* Google AdSense — pub ID를 실제 값으로 교체 필요 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
