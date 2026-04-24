"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/cn";
import { calculateTotalCents, formatEur, type LessonType } from "@/lib/pricing";

type Props = {
  slotStartsAtIso: string;
  slotSummary: string;
};

type FieldErrors = Partial<Record<
  "customerName" | "customerPhone" | "customerEmail" | "lessonType" | "headcount" | "notes",
  string
>>;

const SLOT_DURATION_HOURS = 2;

export function BookingForm({ slotStartsAtIso, slotSummary }: Props) {
  const t = useTranslations("book.form");
  const tErrors = useTranslations("book.errors");
  const tTypes = useTranslations("book.lessonTypes");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("private");
  const [headcount, setHeadcount] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const lessonOrder: LessonType[] = ["private", "kids", "group", "freestyle", "offpiste"];

  const estimatedCents = useMemo(
    () => calculateTotalCents(lessonType, SLOT_DURATION_HOURS, headcount),
    [lessonType, headcount],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: slotStartsAtIso,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          lessonType,
          headcount,
          notes,
        }),
      });

      if (res.status === 409) {
        setError(tErrors("slotTaken"));
        return;
      }
      if (res.status === 400) {
        const body = (await res.json()) as {
          issues?: { path: (string | number)[]; message: string }[];
        };
        const errs: FieldErrors = {};
        for (const issue of body.issues ?? []) {
          const key = issue.path[0] as keyof FieldErrors | undefined;
          if (key) errs[key] = issue.message;
        }
        setFieldErrors(errs);
        setError(tErrors("validation"));
        return;
      }
      if (!res.ok) {
        setError(tErrors("generic"));
        return;
      }

      const body = (await res.json()) as { bookingId: string };
      window.location.href = `/${locale}/book/confirmed/${body.bookingId}`;
    } catch {
      setError(tErrors("generic"));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-white placeholder-white/30 focus:border-white/40 focus:outline-none text-base";
  const labelClass = "text-white/70 text-[11px] uppercase tracking-[0.3em]";
  const sectionHeaderClass = "text-white/40 text-[11px] uppercase tracking-[0.3em]";

  const disabled = submitting || !name.trim() || !phone.trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <div className="rounded-3xl border border-white/15 bg-neutral-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className={sectionHeaderClass}>{t("slotLabel")}</p>
          <p className="text-white text-base md:text-lg font-medium lowercase">{slotSummary}</p>
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
          {SLOT_DURATION_HOURS}h · {tTypes(lessonType)}
        </p>
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className={sectionHeaderClass}>{t("sections.details")}</legend>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("name")}</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              maxLength={80}
            />
            {fieldErrors.customerName && (
              <span className="text-red-300 text-xs">{fieldErrors.customerName}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("phone")}</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+359 ..."
            />
            {fieldErrors.customerPhone && (
              <span className="text-red-300 text-xs">{fieldErrors.customerPhone}</span>
            )}
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t("email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder={t("emailHint")}
          />
          {fieldErrors.customerEmail && (
            <span className="text-red-300 text-xs">{fieldErrors.customerEmail}</span>
          )}
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className={sectionHeaderClass}>{t("sections.lesson")}</legend>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("lessonType")}</span>
            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value as LessonType)}
              className={inputClass}
            >
              {lessonOrder.map((type) => (
                <option key={type} value={type}>
                  {tTypes(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>{t("headcount")}</span>
            <select
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className={inputClass}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={sectionHeaderClass}>{t("sections.extras")}</legend>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t("notes")}</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={cn(inputClass, "min-h-[110px] resize-none")}
            placeholder={t("notesHint")}
            maxLength={500}
          />
        </label>
      </fieldset>

      <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className={sectionHeaderClass}>{t("totalLabel")}</p>
            <p className="text-white text-3xl md:text-4xl font-medium tracking-tight">
              {formatEur(estimatedCents)}
            </p>
          </div>
          <p className="text-white/50 text-xs lowercase text-right max-w-[180px] md:max-w-none leading-relaxed">
            {t("totalHint")}
          </p>
        </div>

        {error && (
          <p className="text-red-300 text-sm lowercase">
            {tErrors("prefix")}: {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "rounded-full bg-white text-black px-8 py-4 text-sm font-medium lowercase hover:bg-white/90 transition-colors",
            disabled && "opacity-40 cursor-not-allowed hover:bg-white",
          )}
        >
          {submitting ? t("submitting") : `${t("submit")} · ${formatEur(estimatedCents)}`}
        </button>
      </div>
    </form>
  );
}
