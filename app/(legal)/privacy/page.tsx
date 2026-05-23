import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 · 삐롱",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-05-23";
const OPERATOR_EMAIL = "support@bbirong.app"; // ★ 실제 출시 전 본인 이메일로 교체

export default function PrivacyPage() {
  return (
    <article className="prose-content flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold mb-1">개인정보처리방침</h1>
        <p className="text-xs text-muted-foreground">
          최종 수정일: {LAST_UPDATED}
        </p>
      </header>

      <Section title="1. 총칙">
        <p>
          삐롱(Bbirong, 이하 「서비스」)은 이용자의 개인정보를 소중히
          여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은
          서비스가 어떤 정보를 어떻게 수집·이용·보관하는지 설명합니다.
        </p>
      </Section>

      <Section title="2. 수집하는 개인정보 항목">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <b>회원가입 시</b>: 이메일 주소, 비밀번호 (해시 저장)
          </li>
          <li>
            <b>서비스 이용 시</b>: 사용자가 직접 입력한 습관 정보(제목,
            이모지, 빈도), 일별 체크 기록, 한 줄 메모
          </li>
          <li>
            <b>자동 수집</b>: 접속 로그, 쿠키, 기기 정보 (서비스 운영
            목적의 최소한)
          </li>
        </ul>
      </Section>

      <Section title="3. 수집 및 이용 목적">
        <ul className="list-disc pl-5 space-y-1">
          <li>회원 식별 및 로그인 유지</li>
          <li>본인의 습관·기록 데이터 저장 및 동기화</li>
          <li>서비스 개선을 위한 통계 분석 (개인 식별 불가 형태)</li>
        </ul>
      </Section>

      <Section title="4. 보관 기간">
        <p>
          회원 탈퇴 시점까지 보관합니다. 탈퇴 즉시 모든 개인정보 및 관련
          기록(습관, 로그, 메모)이 데이터베이스에서 삭제됩니다(cascade
          delete).
        </p>
      </Section>

      <Section title="5. 제3자 제공">
        <p>
          이용자의 개인정보를 외부에 별도 제공하지 않습니다. 단, 법령에
          따라 요구되는 경우에는 그러지 아니합니다.
        </p>
      </Section>

      <Section title="6. 처리위탁">
        <p>안정적 서비스 운영을 위해 다음 업체에 일부 처리를 위탁합니다.</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <b>Supabase Inc.</b> (미국) — 인증 및 데이터베이스 호스팅
          </li>
          <li>
            <b>Vercel Inc.</b> (미국) — 웹사이트 호스팅
          </li>
        </ul>
        <p className="mt-2">
          위탁 업체는 위탁 목적 외 개인정보를 이용할 수 없으며, 국제 표준
          보안 인증을 받은 곳입니다.
        </p>
      </Section>

      <Section title="7. 이용자 권리">
        이용자는 언제든 본인의 데이터에 대해 다음 권리를 행사할 수 있습니다.
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>열람: 앱 내에서 본인 데이터 전체 확인</li>
          <li>수정: 습관·메모 등 직접 수정 가능</li>
          <li>삭제: 개별 항목 삭제 또는 회원 탈퇴</li>
          <li>
            내보내기: 설정 → 「내 데이터 내보내기」에서 JSON 파일로
            다운로드
          </li>
        </ul>
      </Section>

      <Section title="8. 보안 조치">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <b>RLS (Row Level Security)</b>: 데이터베이스 단에서 본인
            데이터만 접근 가능하도록 강제
          </li>
          <li>전송 구간 암호화 (HTTPS/TLS)</li>
          <li>비밀번호 일방향 해시 저장</li>
          <li>접속 로그 모니터링</li>
        </ul>
      </Section>

      <Section title="9. 책임자 연락처">
        <p>개인정보 관련 문의는 아래로 보내주세요.</p>
        <p className="mt-2">
          이메일:{" "}
          <a
            href={`mailto:${OPERATOR_EMAIL}`}
            className="text-primary underline"
          >
            {OPERATOR_EMAIL}
          </a>
        </p>
      </Section>

      <Section title="10. 방침 변경">
        <p>
          본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시
          서비스 내 공지합니다.
        </p>
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
