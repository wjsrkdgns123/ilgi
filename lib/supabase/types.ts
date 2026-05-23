/**
 * Supabase Database 타입 정의 (수동).
 * v1.1 에서 `supabase gen types typescript` 로 자동 생성으로 전환 예정.
 *
 * Supabase v2 SDK는 Database가 type alias + 각 테이블에 Relationships,
 * public.Views/Functions/Enums/CompositeTypes를 요구한다. 빠뜨리면 select 결과가
 * `never`로 추론되어 빌드 깨짐.
 */

export type Frequency = "daily" | "weekdays";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type GoalStatus = "active" | "done" | "archived";
export type ScheduleStatus = "planned" | "done" | "skipped";

export type Database = {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          emoji: string | null;
          frequency: Frequency;
          weekdays: number[];
          target_per_day: number;
          goal_id: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          emoji?: string | null;
          frequency?: Frequency;
          weekdays?: number[];
          target_per_day?: number;
          goal_id?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          emoji?: string | null;
          frequency?: Frequency;
          weekdays?: number[];
          target_per_day?: number;
          goal_id?: string | null;
          active?: boolean;
          sort_order?: number;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      habit_logs: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          date: string;
          count: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          date: string;
          count?: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          date?: string;
          count?: number;
          note?: string | null;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_date: string | null;
          status: GoalStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          target_date?: string | null;
          status?: GoalStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          target_date?: string | null;
          status?: GoalStatus;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          title: string;
          done: boolean;
          due_date: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          user_id: string;
          title: string;
          done?: boolean;
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          user_id?: string;
          title?: string;
          done?: boolean;
          due_date?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          weekdays: number[];
          start_time: string | null;
          duration_min: number | null;
          goal_id: string | null;
          color: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          weekdays?: number[];
          start_time?: string | null;
          duration_min?: number | null;
          goal_id?: string | null;
          color?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          weekdays?: number[];
          start_time?: string | null;
          duration_min?: number | null;
          goal_id?: string | null;
          color?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };
      schedule_blocks: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string | null;
          title: string;
          routine_id: string | null;
          goal_id: string | null;
          status: ScheduleStatus;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time?: string | null;
          title: string;
          routine_id?: string | null;
          goal_id?: string | null;
          status?: ScheduleStatus;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string | null;
          title?: string;
          routine_id?: string | null;
          goal_id?: string | null;
          status?: ScheduleStatus;
          note?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
