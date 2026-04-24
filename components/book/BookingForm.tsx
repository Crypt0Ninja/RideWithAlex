"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/cn";

type LessonType = "private" | "group" | "kids" | "freestyle" | "offpiste";

type Props = {
  slotStartsAtIso: string;
  slotSummary: string;
};

type FieldErrors = Partial<Record<
  "customerName" | "customerPhone" | "customerEmail" | "lessonType" | "headcount" | "notes",
  string
>>;

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

  const labelClass = "text-white/70 text-xs uppercase tracking-[0.3em]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-12">
      <div className="rounded-3xl border border-white/10 bg-neutral-900 px-6 py-4 flex items-center justify-between">
        <p className={labelClass}>{t("slotLabel")}</p>
        <p className="text-white text-sm font-medium lowercase">{slotSummary}</p>
      </div>

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

      {error && (
        <p className="text-red-300 text-sm lowercase">
          {tErrors("prefix")}: {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !name || !phone}
        className={cn(
          "rounded-full bg-white text-black px-8 py-4 text-sm font-medium lowercase hover:bg-white/90 transition-colors",
          (submitting || !name || !phone) && "opacity-40 cursor-not-allowed hover:bg-white",
        )}
      >
        {submitting ? t("submitting") : `${t("submit")} →`}
      </button>
    </form>
  );
}
