import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; celeb?: string; type?: string }>;
}): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const score = params.score || "??";
  const celeb = params.celeb || "";
  const faceType = params.type || "";

  const title = celeb
    ? `나 ${celeb}이랑 닮았대! 매력 ${score}점 — FaceVibe AI`
    : `매력 점수 ${score}점! — FaceVibe AI`;
  const description = celeb
    ? `나 ${celeb}이랑 닮았대! 매력 점수 ${score}점, 얼굴형 ${faceType}. 넌 누구랑 닮았어? 궁금하면 해봐!`
    : "AI가 분석한 나의 얼굴 매력 점수. 넌 누구랑 닮았어? 지금 바로 확인해봐!";

  const ogImageParams = new URLSearchParams();
  if (score !== "??") ogImageParams.set("score", score);
  if (celeb) ogImageParams.set("celeb", celeb);
  if (faceType) ogImageParams.set("type", faceType);
  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
