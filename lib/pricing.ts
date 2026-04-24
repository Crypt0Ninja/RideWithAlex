// Placeholder rates. Alex — корригирай когато знаеш final цените.
// Всички цени в лева на час; изчисляваме до стотинки (×100) за int storage в DB.

export type LessonType = "private" | "group" | "kids" | "freestyle" | "offpiste";

const HOURLY_RATE_BGN: Record<LessonType, number> = {
  private: 120,
  kids: 80,
  group: 60,
  freestyle: 150,
  offpiste: 200,
};

export function hourlyRateBgn(type: LessonType): number {
  return HOURLY_RATE_BGN[type];
}

export function calculateTotalStotinki(
  type: LessonType,
  hours: number,
  headcount: number,
): number {
  const rate = HOURLY_RATE_BGN[type];
  return Math.round(rate * hours * headcount * 100);
}

export function formatBgn(stotinki: number): string {
  return `${(stotinki / 100).toFixed(0)} лв`;
}
