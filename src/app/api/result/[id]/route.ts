import { NextRequest, NextResponse } from "next/server";
import { getResult } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext();

    const result = await getResult(env.DB, id);
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      score: result.score,
      scoreBreakdown: result.scoreBreakdown,
      celebrityMatches: result.celebrityMatches,
      surpriseMatch: result.surpriseMatch,
      faceType: result.faceType,
    });
  } catch {
    return NextResponse.json(
      { error: "DB unavailable" },
      { status: 503 }
    );
  }
}
