import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-foreground/5 bg-surface/50 py-6">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-5">
        {/* 법적 링크 */}
        <div className="flex items-center gap-4 text-xs text-foreground/40">
          <Link href="/privacy" className="transition-colors hover:text-foreground/60">
            개인정보처리방침
          </Link>
          <span className="text-foreground/20">|</span>
          <Link href="/terms" className="transition-colors hover:text-foreground/60">
            이용약관
          </Link>
          <span className="text-foreground/20">|</span>
          <a href="mailto:support@facevibe.ai" className="transition-colors hover:text-foreground/60">
            문의
          </a>
        </div>

        {/* 면책 + 저작권 */}
        <p className="text-center text-[11px] leading-relaxed text-foreground/30">
          본 서비스는 오락 목적이며, AI 분석 결과는 참고용입니다.
          <br />
          업로드된 사진은 분석 후 즉시 삭제되며 서버에 저장되지 않습니다.
        </p>
        <p className="text-[11px] text-foreground/25">
          &copy; {new Date().getFullYear()} FaceVibe AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
