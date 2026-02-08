import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 — FaceVibe AI",
  description: "FaceVibe AI의 개인정보 처리 및 면책조항 안내",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#7c3aed] transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          홈으로 돌아가기
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#7c3aed] mb-2">
          개인정보처리방침
        </h1>
        <p className="text-gray-400 text-sm mb-10">FaceVibe AI</p>

        {/* 1. 서비스 개요 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            1. 서비스 개요
          </h2>
          <p className="text-gray-700 leading-relaxed">
            FaceVibe AI(이하 &ldquo;본 서비스&rdquo;)는 사용자가 업로드한 얼굴
            사진을 AI로 분석하여 매력 점수, 닮은 셀럽, 얼굴형 등의 결과를
            제공하는 <strong>오락 및 재미 목적의 웹 서비스</strong>입니다. 본
            서비스는 의학적, 과학적, 미용 관련 전문 서비스가 아니며, 분석 결과는
            순수하게 엔터테인먼트 용도로만 제공됩니다.
          </p>
        </section>

        {/* 2. 개인정보 처리 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            2. 개인정보(사진) 처리 원칙
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            본 서비스는 사용자의 프라이버시를 최우선으로 보호합니다. 업로드된
            사진은 다음 원칙에 따라 처리됩니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
            <li>
              사진은 서버의 <strong>메모리(RAM)에서만 일시적으로 처리</strong>되며,
              디스크나 데이터베이스에 저장되지 않습니다.
            </li>
            <li>
              분석이 완료되는 즉시 메모리에서 <strong>즉시 폐기(삭제)</strong>
              됩니다.
            </li>
            <li>
              어떠한 경우에도 사진 원본 또는 사본이 서버에 보관되지 않습니다.
            </li>
            <li>로그인이나 회원가입 절차가 없으므로 계정 정보를 수집하지 않습니다.</li>
          </ul>
        </section>

        {/* 3. Azure Face API 사용 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            3. Microsoft Azure Face API 사용 안내
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            본 서비스는 얼굴 분석을 위해 Microsoft Azure의 Face API를 사용합니다.
            Azure Face API 이용과 관련하여 다음 사항을 안내드립니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
            <li>
              Azure Face API를 통해 <strong>얼굴 랜드마크(27개 포인트)</strong>
              좌표 데이터만 추출하며, 얼굴 인식(Face Recognition) 기능은 사용하지
              않습니다.
            </li>
            <li>
              Microsoft Azure는 API 호출 시 전송된 이미지를{" "}
              <strong>처리 후 즉시 삭제</strong>하며, 학습 목적으로 사용하지
              않습니다. (Microsoft의{" "}
              <a
                href="https://learn.microsoft.com/ko-kr/legal/cognitive-services/face/data-privacy-security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7c3aed] underline hover:text-purple-800"
              >
                데이터 프라이버시 정책
              </a>{" "}
              참조)
            </li>
            <li>
              원본 사진은 Azure 서버에도 저장되지 않습니다.
            </li>
          </ul>
        </section>

        {/* 4. 데이터 수집 범위 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            4. 데이터 수집 범위
          </h2>

          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              수집하는 정보
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
              <li>분석 결과 데이터: 매력 점수(0~100), 닮은 셀럽 매칭 결과, 얼굴형 분류 결과</li>
              <li>결과 페이지 공유를 위한 고유 식별자(UUID)</li>
              <li>분석 일시</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              수집하지 않는 정보
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
              <li>사진 원본 또는 사본</li>
              <li>이름, 이메일, 전화번호 등 개인식별정보</li>
              <li>위치 정보</li>
              <li>기기 고유 식별자</li>
            </ul>
          </div>
        </section>

        {/* 5. 면책조항 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            5. 면책조항
          </h2>
          <div className="bg-purple-50 border-l-4 border-[#7c3aed] p-4 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed mb-3">
              본 서비스의 분석 결과는{" "}
              <strong>순수한 오락 및 재미 목적</strong>으로 제공되며, 다음 사항에
              대해 어떠한 보증도 하지 않습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
              <li>매력 점수의 의학적, 과학적, 미용학적 정확성</li>
              <li>닮은 셀럽 매칭 결과의 객관적 정확성</li>
              <li>얼굴형 분류의 전문적 정확성</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              분석 결과를 근거로 한 의료, 미용 시술 등의 결정에 대해 본 서비스는
              일체의 책임을 지지 않습니다. 전문적인 상담이 필요한 경우 해당 분야
              전문가에게 문의하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 6. 초상권 관련 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            6. 초상권 관련 안내
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            본 서비스의 &ldquo;닮은 셀럽&rdquo; 매칭 기능은 다음과 같은 방식으로
            작동합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
            <li>
              셀럽 매칭은 <strong>얼굴 비율의 수치 데이터(벡터)를 비교</strong>한
              결과이며, 셀럽의 실제 사진을 사용하거나 저장하지 않습니다.
            </li>
            <li>
              매칭 결과는 수학적 유사도 비교에 기반한 것으로, 해당 셀럽의
              초상권이나 퍼블리시티권을 침해하지 않습니다.
            </li>
            <li>
              본 서비스는 특정 셀럽의 보증이나 후원을 받지 않으며, 셀럽과의 어떠한
              제휴 관계도 없습니다.
            </li>
          </ul>
        </section>

        {/* 7. 광고 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            7. 광고 및 쿠키
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            본 서비스는 운영 비용 충당을 위해 Google AdSense를 통한 광고를 게재할
            수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
            <li>
              Google AdSense는 사용자에게 맞춤형 광고를 제공하기 위해{" "}
              <strong>쿠키</strong>를 사용할 수 있습니다.
            </li>
            <li>
              Google의 광고 쿠키 사용에 관한 자세한 내용은{" "}
              <a
                href="https://policies.google.com/technologies/ads?hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7c3aed] underline hover:text-purple-800"
              >
                Google 광고 정책
              </a>
              을 참조하시기 바랍니다.
            </li>
            <li>
              사용자는 브라우저 설정을 통해 쿠키 사용을 거부하거나 삭제할 수
              있습니다. 다만, 쿠키를 차단할 경우 일부 서비스 이용에 제한이 있을 수
              있습니다.
            </li>
          </ul>
        </section>

        {/* 8. 문의 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#7c3aed] mb-3">
            8. 문의
          </h2>
          <p className="text-gray-700 leading-relaxed">
            본 개인정보처리방침 또는 서비스 이용에 관한 문의사항이 있으시면 아래
            연락처로 문의해 주시기 바랍니다.
          </p>
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>이메일:</strong>{" "}
              <a
                href="mailto:contact@facevibe.ai"
                className="text-[#7c3aed] underline hover:text-purple-800"
              >
                contact@facevibe.ai
              </a>
            </p>
          </div>
        </section>

        {/* 구분선 및 최종 업데이트 */}
        <hr className="border-gray-200 my-8" />
        <p className="text-sm text-gray-400 text-center">
          최종 업데이트: 2026년 2월 8일
        </p>
      </div>
    </main>
  );
}
