import { NextRequest, NextResponse } from "next/server";
import { detectFaces, AzureFaceError } from "@/lib/azure-face";
import { calculateScore, extractFaceRatios } from "@/lib/scoring";
import { matchCelebrities } from "@/lib/celebrity-match";
import { classifyFaceType } from "@/lib/face-type";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "이미지 파일이 필요합니다." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 5MB 이하만 가능합니다." },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return NextResponse.json(
        { error: "JPG, PNG, WebP 이미지만 가능합니다." },
        { status: 400 }
      );
    }

    // Buffer로 변환 (메모리에서만 처리, 디스크 저장 없음)
    const arrayBuffer = await file.arrayBuffer();

    // Azure Face API 호출
    const faces = await detectFaces(arrayBuffer);

    if (faces.length === 0) {
      return NextResponse.json(
        { error: "얼굴을 감지하지 못했습니다. 정면 사진을 사용해 주세요." },
        { status: 422 }
      );
    }

    // 가장 큰 얼굴을 메인으로 사용
    const mainFace = faces.reduce((largest, face) => {
      const area = face.faceRectangle.width * face.faceRectangle.height;
      const largestArea =
        largest.faceRectangle.width * largest.faceRectangle.height;
      return area > largestArea ? face : largest;
    });

    // Step 4: 점수 산출 + 셀럽 매칭 + 얼굴형 분류
    const score = calculateScore(mainFace.faceLandmarks, mainFace.faceRectangle);
    const ratios = extractFaceRatios(mainFace.faceLandmarks, mainFace.faceRectangle);
    const celebrityMatches = matchCelebrities(ratios);
    const faceType = classifyFaceType(mainFace.faceLandmarks, mainFace.faceRectangle);

    // TODO: Step 4 D1 저장은 Cloudflare 환경에서만 동작
    // 로컬 dev에서는 DB 없이 바로 결과 반환
    const resultId = `fv_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`;

    return NextResponse.json({
      success: true,
      id: resultId,
      score: score.total,
      scoreBreakdown: score,
      celebrityMatches,
      faceType,
    });
  } catch (error) {
    if (error instanceof AzureFaceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
