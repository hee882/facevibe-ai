import Link from "next/link";

export const metadata = {
  title: "이용약관 — FaceVibe AI",
  description: "FaceVibe AI 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          &larr; 홈으로
        </Link>

        <h1 className="text-2xl font-bold text-foreground">이용약관</h1>
        <p className="mt-2 text-sm text-foreground/50">
          최종 수정일: 2026년 2월 8일
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제1조 (목적)
            </h2>
            <p className="mt-2">
              본 약관은 FaceVibe AI(이하 &ldquo;서비스&rdquo;)의 이용 조건 및
              절차에 관한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제2조 (서비스 내용)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>AI 기반 얼굴 분석 및 매력 점수 산출</li>
              <li>닮은 셀럽 매칭 (Top 3)</li>
              <li>얼굴형 분석</li>
              <li>분석 결과 공유 기능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제3조 (면책조항)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                본 서비스는 <strong>오락 목적</strong>으로 제공되며, AI 분석
                결과는 의학적·과학적 근거에 기반하지 않습니다.
              </li>
              <li>
                분석 결과의 정확성, 신뢰성, 완전성을 보증하지 않으며, 이를
                근거로 한 의사결정에 대해 책임지지 않습니다.
              </li>
              <li>
                셀럽 닮은꼴 매칭은 수학적 얼굴 비율 비교이며, 해당 셀럽 또는
                소속사와 어떠한 관련도 없습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제4조 (이미지 처리)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                업로드된 이미지는 분석 처리 중에만 메모리에 존재하며, 분석 완료
                후 즉시 폐기됩니다.
              </li>
              <li>서버 디스크에 이미지를 저장하지 않습니다.</li>
              <li>
                분석 결과(점수, 매칭 데이터)는 공유 링크 기능을 위해
                저장될 수 있으며, 이미지 자체는 포함되지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제5조 (지적재산권)
            </h2>
            <p className="mt-2">
              셀럽 이름 및 관련 정보는 해당 권리자에게 귀속되며, 본 서비스는
              공정 이용 범위 내에서 오락 목적으로만 활용합니다. 셀럽 이미지는
              사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제6조 (이용 제한)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>타인의 사진을 무단으로 업로드하는 행위</li>
              <li>서비스를 악용하여 타인을 비방하는 행위</li>
              <li>자동화 도구를 이용한 대량 분석 요청</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제7조 (약관 변경)
            </h2>
            <p className="mt-2">
              본 약관은 서비스 개선을 위해 사전 고지 없이 변경될 수 있으며,
              변경된 약관은 서비스 내 게시한 시점부터 효력이 발생합니다.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-foreground/10 pt-6">
          <Link
            href="/"
            className="text-sm text-primary hover:underline"
          >
            &larr; 홈으로 돌아가기
          </Link>
        </div>
      </article>
    </main>
  );
}
