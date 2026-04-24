// Placeholder EUR rates. Alex — корригирай когато знаеш final цените.
// Всички цени в евро на час; изчисляваме до cents (×100) за int storage в DB.
//
// Matches pricing page: 2h private = €100 total (= 50 EUR/h × 2h × 1 person).

export type LessonType = "private" | "group" | "kids" | "freestyle" | "offpiste";

const HOURLY_RATE_EUR: Record<LessonType, number> = {
  private: 50,
  kids: 45,
  group: 25,
  freestyle: 65,
  offpiste: 90,
};

export function hourlyRateEur(type: LessonType): number {
  return HOURLY_RATE_EUR[type];
}

export function calculateTotalCents(
  type: LessonType,
  hours: number,
  headcount: number,
): number {
  const rate = HOURLY_RATE_EUR[type];
  return Math.round(rate * hours * headcount * 100);
}

export function formatEur(cents: number): string {
  return `€${(cents / 100).toFixed(0)}`;
}
