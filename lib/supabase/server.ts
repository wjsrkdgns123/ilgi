import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

/**
 * 서버 컴포넌트 / Route Handler / Server Action용 Supabase 클라이언트.
 *
 * 사용 (서버 컴포넌트):
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 * 주의: 클라이언트 컴포넌트에서는 import 하지 말 것.
 *       (`import 'server-only'` 가 막아준다)
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll이 Server Component에서 호출됐을 때 발생.
            // middleware에서 세션을 갱신하고 있다면 무시 가능.
          }
        },
      },
    },
  );
}
