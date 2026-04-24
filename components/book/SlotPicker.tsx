"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

export type SerializedSlot = {
  startsAtIso: string;
  endsAtIso: string;
  available: boolean;
};

export type SerializedDay = {
  date: string;
  slots: SerializedSlot[];
};

type Props = {
  days: SerializedDay[];
  selectedIso: string | null;
  onSelect: (iso: string) => void;
  labels: {
    dayLabel: (date: Date) => string;
    timeLabel: (starts: Date, ends: Date) => string;
    fullLabel: string;
    unavailableLabel: string;
    pickDayLabel: string;
    pickSlotLabel: string;
  };
};

export function SlotPicker({ days, selectedIso, onSelect, labels }: Props) {
  const initialDate = selectedIso ? selectedIso.slice(0, 10) : (days[0]?.date ?? "");
  const [activeDate, setActiveDate] = useState(initialDate);
  const currentDay = days.find((d) => d.date === activeDate) ?? days[0];
  const locale = useLocale();

  const weekdayFmt = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    weekday: "short",
    timeZone: "Europe/Sofia",
  });
  const dayNumFmt = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    day: "2-digit",
    timeZone: "Europe/Sofia",
  });
  const monthFmt = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    month: "short",
    timeZone: "Europe/Sofia",
  });

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <div className="flex flex-col gap-4">
        <p className="text-white/40 text-[11px] uppercase tracking-[0.3em]">
          {labels.pickDayLabel}
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          {days.map((day) => {
            const date = new Date(`${day.date}T00:00:00`);
            const isActive = day.date === activeDate;
            const hasAny = day.slots.some((s) => s.available);
            return (
              <button
                key={day.date}
                type="button"
                disabled={!hasAny}
                onClick={() => setActiveDate(day.date)}
                className={cn(
                  "group shrink-0 rounded-2xl border px-5 py-4 min-w-[96px] md:min-w-[104px] flex flex-col items-center gap-1 transition-colors lowercase text-center",
                  isActive
                    ? "border-white bg-white text-black"
                    : hasAny
                      ? "border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      : "border-white/5 bg-neutral-900 text-white/25 cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em]",
                    isActive ? "text-black/50" : "text-white/40",
                  )}
                >
                  {weekdayFmt.format(date).replace(".", "")}
                </span>
                <span className="text-2xl md:text-3xl font-medium tracking-tight">
                  {dayNumFmt.format(date)}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.25em]",
                    isActive ? "text-black/50" : "text-white/40",
                  )}
                >
                  {monthFmt.format(date).replace(".", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-white/40 text-[11px] uppercase tracking-[0.3em]">
          {labels.pickSlotLabel}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {currentDay?.slots.map((slot) => {
            const starts = new Date(slot.startsAtIso);
            const ends = new Date(slot.endsAtIso);
            const isSelected = slot.startsAtIso === selectedIso;
            return (
              <button
                key={slot.startsAtIso}
                type="button"
                disabled={!slot.available}
                onClick={() => onSelect(slot.startsAtIso)}
                className={cn(
                  "rounded-2xl border px-5 py-5 text-left transition-colors",
                  isSelected
                    ? "border-white bg-white text-black"
                    : slot.available
                      ? "border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      : "border-white/5 bg-neutral-900 text-white/25 cursor-not-allowed",
                )}
              >
                <span className="block text-lg font-medium lowercase tracking-tight">
                  {labels.timeLabel(starts, ends)}
                </span>
                <span
                  className={cn(
                    "block text-[10px] uppercase tracking-[0.3em] mt-3",
                    isSelected ? "text-black/50" : "text-white/40",
                  )}
                >
                  {slot.available ? labels.fullLabel : labels.unavailableLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
