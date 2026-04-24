"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { SlotPicker, type SerializedDay } from "./SlotPicker";
import { BookingForm } from "./BookingForm";

type Props = {
  days: SerializedDay[];
};

export function BookingFlow({ days }: Props) {
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const t = useTranslations("book.picker");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Sofia",
  });

  const timeFormatter = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Sofia",
  });

  const dayLabel = (d: Date) => dateFormatter.format(d).toLowerCase();
  const timeLabel = (a: Date, b: Date) =>
    `${timeFormatter.format(a)} — ${timeFormatter.format(b)}`;
  const fullSummary = (a: Date, b: Date) =>
    `${dateFormatter.format(a).toLowerCase()} · ${timeLabel(a, b)}`;

  const selectedDay = selectedIso
    ? days.find((d) => d.date === selectedIso.slice(0, 10))
    : undefined;
  const selectedSlot = selectedDay?.slots.find((s) => s.startsAtIso === selectedIso);

  return (
    <div className="flex flex-col gap-10">
      <SlotPicker
        days={days}
        selectedIso={selectedIso}
        onSelect={setSelectedIso}
        labels={{
          dayLabel,
          timeLabel,
          fullLabel: t("available"),
          unavailableLabel: t("taken"),
          pickDayLabel: t("pickDay"),
          pickSlotLabel: t("pickSlot"),
        }}
      />

      {selectedIso && selectedSlot && (
        <BookingForm
          slotStartsAtIso={selectedIso}
          slotSummary={fullSummary(
            new Date(selectedSlot.startsAtIso),
            new Date(selectedSlot.endsAtIso),
          )}
        />
      )}
    </div>
  );
}
