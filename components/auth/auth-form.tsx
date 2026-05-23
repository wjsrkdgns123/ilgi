"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Zod v4 syntax: error 메시지는 옵션 객체로 전달
const schema = z.object({
  email: z
    .string()
    .min(1, { error: "이메일을 입력해주세요." })
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      error: "이메일 형식이 올바르지 않습니다.",
    }),
  password: z
    .string()
    .min(6, { error: "비밀번호는 6자 이상이어야 합니다." }),
});

type FormValues = z.infer<typeof schema>;
type Mode = "login" | "signup";

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 disabled:opacity-50";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("login");
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          toast.error(translateAuthError(error.message));
          return;
        }
        toast.success("가입 완료! 잠시만 기다려주세요.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          toast.error(translateAuthError(error.message));
          return;
        }
      }

      router.push("/today");
      router.refresh();
    } catch (err) {
      toast.error("알 수 없는 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          className={cn(inputClass)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="6자 이상"
          aria-invalid={!!errors.password}
          className={cn(inputClass)}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2 h-11 w-full"
        disabled={submitting}
      >
        {submitting
          ? "처리 중..."
          : mode === "login"
            ? "로그인"
            : "회원가입"}
      </Button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          reset();
          clearErrors();
        }}
        className="mt-2 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {mode === "login"
          ? "처음이세요? 회원가입"
          : "이미 가입했나요? 로그인"}
      </button>
    </form>
  );
}
