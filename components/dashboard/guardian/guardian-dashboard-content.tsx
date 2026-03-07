"use client";

import { format } from "date-fns";
import { Calendar, CalendarDays } from "lucide-react";
import { GuardianCalendar } from "./guardian-calendar";
import { GuardianCalendarWeekly } from "./guardian-calendar-weekly";
import { GuardianCalendarSkeleton } from "@/components/dashboard/main/dashboard-skeletons";

export type GuardianPair = {
  athleteId: string;
  athleteName: string;
  groupId: string;
  groupName: string;
};

type CalendarData = {
  athleteId: string;
  groupId: string;
  athleteName: string;
  groupName: string;
  dates: Record<string, string>;
  attendanceByDate: Record<string, "present" | "absent" | "excused">;
  trainingDayDates?: Record<string, true>;
};

interface GuardianDashboardContentProps {
  selectedPairs: GuardianPair[];
  calendars: CalendarData[];
  isLoading: boolean;
  viewMode: "month" | "week";
  onViewModeChange: (mode: "month" | "week") => void;
  month: string;
  onMonthChange: (month: string) => void;
  weekStart: string;
  onWeekChange: (delta: number) => void;
}

export function GuardianDashboardContent({
  selectedPairs,
  calendars,
  isLoading,
  viewMode,
  onViewModeChange,
  month,
  onMonthChange,
  weekStart,
  onWeekChange,
}: GuardianDashboardContentProps) {
  if (selectedPairs.length === 0) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-2xl">
          <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            Select athletes and groups from the sidebar to view calendars.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onViewModeChange("month")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "month"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Month
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("week")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "week"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Week
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <GuardianCalendarSkeleton />
          </div>
        ) : (
          <div className="space-y-8">
            {calendars.map((cal) => (
              <div key={`${cal.athleteId}:${cal.groupId}`}>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {cal.athleteName} – {cal.groupName}
                </h3>
                {viewMode === "month" ? (
                  <GuardianCalendar
                    month={month}
                    dates={cal.dates}
                    attendanceByDate={cal.attendanceByDate}
                    trainingDayDates={cal.trainingDayDates ?? {}}
                    onMonthChange={onMonthChange}
                  />
                ) : (
                  <GuardianCalendarWeekly
                    weekStart={weekStart}
                    dates={cal.dates}
                    attendanceByDate={cal.attendanceByDate}
                    trainingDayDates={cal.trainingDayDates ?? {}}
                    onPrevWeek={() => onWeekChange(-1)}
                    onNextWeek={() => onWeekChange(1)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
