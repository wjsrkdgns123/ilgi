import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 · 삐롱",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-05-23";

export default function TermsPage() {
  return (
    <article className="prose-content flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold mb-1">이용약관</h1>
        <p className="text-xs text-muted-foreground">
          최종 수정일: {LAST_UPDATED}
        </p>
      </header>

      <Section title="제1조 (목적)">
        <p>
          본 약관은 삐롱(Bbirong, 이하 「서비스」)의 이용 조건 및 운영자와
          이용자 간 권리·의무를 정함을 목적으로 합니다.
        </p>
      </Section>

      <Section title="제2조 (정의)">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <b>서비스</b>: 습관 기록·관리를 돕는 웹/PWA 애플리케이션
            「삐롱」
          </li>
          <li>
            <b>이용자</b>: 본 약관에 동의하고 서비스를 이용하는 개인
          </li>
          <li>
            <b>계정</b>: 이용자가 서비스에 등록한 이메일 기반의 식별 정보
          </li>
        </ul>
      </Section>

      <Section title="제3조 (약관의 효력)">
        <p>
          본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 운영자는
          관련 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며, 개정
          시 서비스 내 공지합니다.
        </p>
      </Section>

      <Section title="제4조 (회원가입)">
        <ul className="list-disc pl-5 space-y-1">
          <li>이용자는 실명 또는 활동명으로 가입할 수 있습니다.</li>
          <li>만 14세 미만은 보호자 동의가 필요합니다.</li>
          <li>
            가입 시 입력한 정보는 정확해야 하며, 허위 정보로 인한 불이익은
            이용자 본인에게 있습니다.
          </li>
        </ul>
      </Section>

      <Section title="제5조 (이용자의 의무)">
        <ul className="list-disc pl-5 space-y-1">
          <li>비밀번호 보안 관리</li>
          <li>타인의 권리·명예·사생활 침해 금지</li>
          <li>서비스의 정상적 운영을 방해하는 행위 금지</li>
          <li>관련 법령 준수</li>
        </ul>
      </Section>

      <Section title="제6조 (운영자의 의무)">
        <p>
          운영자는 안정적인 서비스 제공을 위해 최선을 다하며, 이용자의
          개인정보 보호를 위해 「개인정보처리방침」을 별도로 운영합니다.
        </p>
      </Section>

      <Section title="제7조 (서비스 변경 및 중단)">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            운영자는 서비스 개선을 위해 기능을 변경하거나 추가할 수
            있습니다.
          </li>
          <li>
            기술적 사정, 천재지변 등 부득이한 경우 서비스가 일시 중단될 수
            있으며, 사전 공지를 위해 노력합니다.
          </li>
        </ul>
      </Section>

      <Section title="제8조 (회원 탈퇴 및 자료 삭제)">
        <p>
          이용자는 언제든 회원 탈퇴를 요청할 수 있으며, 탈퇴 즉시 모든
          개인정보와 기록(습관, 로그, 메모)이 데이터베이스에서 삭제됩니다.
          삭제된 데이터는 복구되지 않습니다.
        </p>
      </Section>

      <Section title="제9조 (면책)">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            서비스는 「있는 그대로(as-is)」 제공되며, 특정 목적에의
            적합성을 보장하지 않습니다.
          </li>
          <li>
            이용자의 행위(또는 부작위)로 인한 결과는 이용자 본인에게
            귀속됩니다.
          </li>
          <li>
            천재지변, 외부 서비스(예: Supabase, Vercel) 장애로 인한
            서비스 중단·데이터 손실에 대해 운영자는 책임을 지지 않습니다.
            (이용자는 「설정 → 내 데이터 내보내기」로 정기 백업 권장)
          </li>
        </ul>
      </Section>

      <Section title="제10조 (분쟁 해결)">
        <p>
          서비스 이용 중 분쟁은 운영자와 이용자 간 협의로 해결을 우선하며,
          협의가 어려운 경우 「콘텐츠분쟁조정위원회」 또는 관할 법원의
          판단을 따릅니다.
        </p>
      </Section>

      <Section title="부칙">
        <p>본 약관은 {LAST_UPDATED}부터 시행됩니다.</p>
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-2">{title}</h2>
      <div className="text-sm text-foreground/85 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
