import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/lib/booking";

const phoneRegex = /^[+0-9\s()-]{6,20}$/;

const bookingSchema = z.object({
  startsAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "invalid_start_time",
  }),
  customerName: z.string().trim().min(2).max(80),
  customerPhone: z.string().trim().regex(phoneRegex, "invalid_phone"),
  customerEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  lessonType: z.enum(["private", "group", "kids", "freestyle", "offpiste"]),
  headcount: z.number().int().min(1).max(4),
  notes: z
    .string()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const startsAt = new Date(data.startsAt);

  try {
    const result = await createBooking({
      startsAt,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      lessonType: data.lessonType,
      headcount: data.headcount,
      notes: data.notes,
    });

    return NextResponse.json(
      { bookingId: result.bookingId, totalCents: result.totalCents },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    const status = message === "slot_unavailable" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
