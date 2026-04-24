"use client";

import { useState } from "react";
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

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
          {labels.pickDayLabel}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
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
                  "shrink-0 rounded-2xl border px-5 py-3 text-sm transition-colors lowercase",
                  isActive
                    ? "border-white bg-white text-black"
                    : hasAny
                      ? "border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      : "border-white/5 bg-neutral-900 text-white/30 cursor-not-allowed",
                )}
              >
                {labels.dayLabel(date)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
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
                  "rounded-2xl border px-5 py-4 text-left transition-colors",
                  isSelected
                    ? "border-white bg-white text-black"
                    : slot.available
                      ? "border-white/10 bg-neutral-900 text-white hover:border-white/30"
                      : "border-white/5 bg-neutral-900 text-white/30 cursor-not-allowed",
                )}
              >
                <span className="block text-base font-medium lowercase">
                  {labels.timeLabel(starts, ends)}
                </span>
                <span
                  className={cn(
                    "block text-xs uppercase tracking-[0.3em] mt-2",
                    isSelected ? "text-black/60" : "text-white/40",
                  )}
                >
                  {slot.available ? labels.fullLabel : labels.unavailableLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
