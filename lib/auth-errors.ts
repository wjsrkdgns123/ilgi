/**
 * Supabase 인증 에러 메시지를 한국어로 변환.
 * 모르는 에러는 원문 그대로.
 */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("user already registered"))
    return "이미 가입된 이메일입니다. 로그인해주세요.";
  if (m.includes("email not confirmed"))
    return "이메일 확인이 필요합니다. 받은 메일함을 확인해주세요.";
  if (m.includes("password should be at least"))
    return "비밀번호는 6자 이상이어야 합니다.";
  if (m.includes("unable to validate email address"))
    return "이메일 형식이 올바르지 않습니다.";
  if (m.includes("over email send rate limit"))
    return "메일 전송 한도 초과. 잠시 후 다시 시도해주세요.";
  if (m.includes("signup is disabled"))
    return "현재 회원가입이 비활성화되어 있습니다.";
  if (m.includes("anonymous sign-ins are disabled"))
    return "익명 로그인은 지원하지 않습니다.";
  return message;
}
