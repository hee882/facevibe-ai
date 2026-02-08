import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.subset.woff";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL);
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const score = searchParams.get("score") || "??";
  const celeb = searchParams.get("celeb") || "";
  const faceType = searchParams.get("type") || "";

  const fontData = await loadFont();

  const fonts = fontData
    ? [
        {
          name: "Pretendard",
          data: fontData,
          style: "normal" as const,
          weight: 700 as const,
        },
      ]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #f472b6 100%)",
          fontFamily: fontData ? "Pretendard" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            borderRadius: 32,
            padding: "48px 64px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 700,
              gap: 8,
            }}
          >
            <span style={{ color: "#7c3aed" }}>FaceVibe</span>
            <span style={{ color: "#171717" }}>AI</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: 16,
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: "#7c3aed",
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 36,
                color: "#a1a1aa",
                fontWeight: 700,
              }}
            >
              점
            </span>
          </div>

          {(celeb || faceType) && (
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 16,
                fontSize: 24,
                color: "#52525b",
              }}
            >
              {celeb && (
                <span style={{ display: "flex" }}>
                  닮은 셀럽:{" "}
                  <b style={{ color: "#171717", marginLeft: 4 }}>{celeb}</b>
                </span>
              )}
              {faceType && (
                <span style={{ display: "flex" }}>
                  얼굴형:{" "}
                  <b style={{ color: "#171717", marginLeft: 4 }}>{faceType}</b>
                </span>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 22,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          나도 분석해보기
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts ? { fonts } : {}),
    }
  );
}
