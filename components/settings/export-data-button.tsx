"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * 본인 데이터(habits + habit_logs) 전체를 JSON으로 다운로드.
 * 파일명: bbirong-export-YYYY-MM-DD.json
 *
 * 사업계획 §2 차별점 — 데이터는 사용자 것. 언제든 챙겨갈 수 있다는 안심감.
 */
export function ExportDataButton() {
  const [loading, setLoading] = React.useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("로그인이 필요해요.");
        return;
      }

      const [habitsRes, logsRes] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id),
      ]);

      if (habitsRes.error || logsRes.error) {
        toast.error("데이터를 불러오지 못했어. 다시 시도해줘.");
        console.error(habitsRes.error ?? logsRes.error);
        return;
      }

      const payload = {
        exported_at: new Date().toISOString(),
        app: "bbirong",
        version: "1.0",
        email: user.email,
        user_id: user.id,
        habits: habitsRes.data ?? [],
        habit_logs: logsRes.data ?? [],
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `bbirong-export-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const totalRows =
        (habitsRes.data?.length ?? 0) + (logsRes.data?.length ?? 0);
      toast.success(`내려받기 완료 · 총 ${totalRows}개 기록`);
    } catch (err) {
      toast.error("내보내기 중 오류가 발생했어.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      className="w-full justify-start gap-2"
    >
      <Download className="size-4" />
      {loading ? "준비 중..." : "내 데이터 내보내기 (JSON)"}
    </Button>
  );
}
