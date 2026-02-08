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
            padding: "40px 56px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            gap: 4,
            maxWidth: 900,
          }}
        >
          {/* 로고 */}
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              gap: 8,
            }}
          >
            <span style={{ color: "#7c3aed" }}>FaceVibe</span>
            <span style={{ color: "#171717" }}>AI</span>
          </div>

          {/* 메인 메시지 */}
          {celeb ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20,
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#171717",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                나 {celeb}이랑 닮았대!
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 80,
                    fontWeight: 700,
                    color: "#7c3aed",
                    lineHeight: 1,
                  }}
                >
                  {score}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    color: "#a1a1aa",
                    fontWeight: 700,
                  }}
                >
                  점
                </span>
              </div>
            </div>
          ) : (
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
                  fontSize: 100,
                  fontWeight: 700,
                  color: "#7c3aed",
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: 32,
                  color: "#a1a1aa",
                  fontWeight: 700,
                }}
              >
                점
              </span>
            </div>
          )}

          {/* 얼굴형 태그 */}
          {faceType && (
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontSize: 20,
                color: "#7c3aed",
                background: "rgba(124,58,237,0.08)",
                padding: "6px 20px",
                borderRadius: 20,
              }}
            >
              {faceType}
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 28,
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "white",
              fontWeight: 700,
            }}
          >
            넌 누구랑 닮았어? 궁금하지 않아?
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            사진은 서버에 저장되지 않아요
          </div>
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
