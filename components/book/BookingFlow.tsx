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
  const tSteps = useTranslations("book.steps");
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

  const longDateFormatter = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "Europe/Sofia",
  });

  const dayLabel = (d: Date) => dateFormatter.format(d).toLowerCase();
  const timeLabel = (a: Date, b: Date) =>
    `${timeFormatter.format(a)} — ${timeFormatter.format(b)}`;

  const selectedDay = selectedIso
    ? days.find((d) => d.date === selectedIso.slice(0, 10))
    : undefined;
  const selectedSlot = selectedDay?.slots.find((s) => s.startsAtIso === selectedIso);

  const selectedStart = selectedSlot ? new Date(selectedSlot.startsAtIso) : null;
  const selectedEnd = selectedSlot ? new Date(selectedSlot.endsAtIso) : null;

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      <StepBlock number="01" label={tSteps("pickTime")}>
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
      </StepBlock>

      {selectedIso && selectedStart && selectedEnd && (
        <StepBlock number="02" label={tSteps("yourDetails")}>
          <BookingForm
            slotStartsAtIso={selectedIso}
            slotSummary={`${longDateFormatter.format(selectedStart).toLowerCase()} · ${timeLabel(
              selectedStart,
              selectedEnd,
            )}`}
          />
        </StepBlock>
      )}
    </div>
  );
}

function StepBlock({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 md:gap-12">
      <header className="flex items-center gap-5 border-b border-white/10 pb-5">
        <span className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/15 text-white/70 text-sm md:text-base font-medium tracking-tight">
          {number}
        </span>
        <p className="text-white text-sm md:text-base uppercase tracking-[0.3em]">{label}</p>
      </header>
      {children}
    </section>
  );
}
