/**
 * Azure Face API 클라이언트
 * 얼굴 감지 + 27개 랜드마크 반환
 */

export interface FaceLandmarks {
  pupilLeft: Point;
  pupilRight: Point;
  noseTip: Point;
  mouthLeft: Point;
  mouthRight: Point;
  eyebrowLeftOuter: Point;
  eyebrowLeftInner: Point;
  eyeLeftOuter: Point;
  eyeLeftTop: Point;
  eyeLeftBottom: Point;
  eyeLeftInner: Point;
  eyebrowRightInner: Point;
  eyebrowRightOuter: Point;
  eyeRightInner: Point;
  eyeRightTop: Point;
  eyeRightBottom: Point;
  eyeRightOuter: Point;
  noseRootLeft: Point;
  noseRootRight: Point;
  noseLeftAlarTop: Point;
  noseRightAlarTop: Point;
  noseLeftAlarOutTip: Point;
  noseRightAlarOutTip: Point;
  upperLipTop: Point;
  upperLipBottom: Point;
  underLipTop: Point;
  underLipBottom: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface FaceRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface FaceAttributes {
  headPose: {
    pitch: number;
    roll: number;
    yaw: number;
  };
}

export interface DetectedFace {
  faceId?: string;
  faceRectangle: FaceRectangle;
  faceLandmarks: FaceLandmarks;
  faceAttributes?: FaceAttributes;
}

export class AzureFaceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "AzureFaceError";
  }
}

/**
 * Azure Face API로 얼굴을 감지하고 랜드마크를 반환합니다.
 * @param imageBuffer - 이미지 바이너리 데이터
 * @returns 감지된 얼굴 배열
 */
export async function detectFaces(
  imageBuffer: ArrayBuffer
): Promise<DetectedFace[]> {
  const endpoint = process.env.AZURE_FACE_ENDPOINT;
  const key = process.env.AZURE_FACE_KEY;

  if (!endpoint || !key) {
    throw new AzureFaceError(
      "Azure Face API 설정이 누락되었습니다.",
      500,
      "CONFIG_MISSING"
    );
  }

  const url = `${endpoint}/face/v1.0/detect?returnFaceLandmarks=true&returnFaceAttributes=headPose&detectionModel=detection_01&recognitionModel=recognition_04`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream",
    },
    body: imageBuffer,
  });

  if (!response.ok) {
    const status = response.status;

    if (status === 429) {
      throw new AzureFaceError(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        429,
        "RATE_LIMITED"
      );
    }

    if (status === 400) {
      const body = (await response.json().catch(() => null)) as { error?: { code?: string } } | null;
      const code = body?.error?.code;
      if (code === "InvalidImage" || code === "InvalidImageSize") {
        throw new AzureFaceError(
          "이미지를 인식할 수 없습니다. 다른 사진을 시도해 주세요.",
          400,
          code
        );
      }
    }

    throw new AzureFaceError(
      `Azure Face API 오류 (${status})`,
      status,
      "API_ERROR"
    );
  }

  const faces = (await response.json()) as DetectedFace[];
  return faces;
}
