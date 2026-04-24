import { Resend } from "resend";
import { formatBgn } from "@/lib/pricing";

export type BookingForEmail = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  lessonType: string;
  headcount: number;
  totalStotinki: number;
  startsAt: Date;
  endsAt: Date;
  notes: string | null;
};

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing from environment");
  resendClient = new Resend(apiKey);
  return resendClient;
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

function getAlexAddress(): string {
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) throw new Error("RESEND_TO_EMAIL missing from environment");
  return to;
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Sofia",
});

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Sofia",
});

function formatDateRange(starts: Date, ends: Date): string {
  return `${DATE_FMT.format(starts)}, ${TIME_FMT.format(starts)} — ${TIME_FMT.format(ends)} (Sofia time)`;
}

function baseStyles() {
  return `
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#000; color:#fff; margin:0; padding:40px 20px; }
    .wrap { max-width:560px; margin:0 auto; }
    h1 { font-size:28px; font-weight:500; margin:0 0 8px; letter-spacing:-0.02em; }
    .eyebrow { font-size:11px; text-transform:uppercase; letter-spacing:0.3em; color:rgba(255,255,255,0.4); margin-bottom:24px; }
    .card { background:#0a0a0a; border:1px solid rgba(255,255,255,0.06); border-radius:24px; padding:24px; margin:24px 0; }
    .row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
    .row:last-child { border-bottom:none; }
    .label { color:rgba(255,255,255,0.4); font-size:11px; text-transform:uppercase; letter-spacing:0.2em; }
    .value { color:#fff; font-size:14px; }
    p { color:rgba(255,255,255,0.7); font-size:14px; line-height:1.6; }
    a { color:#fff; }
    .footer { color:rgba(255,255,255,0.3); font-size:12px; margin-top:40px; text-align:center; }
  `;
}

function renderCustomerHtml(b: BookingForEmail): string {
  const dateRange = formatDateRange(b.startsAt, b.endsAt);
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Booking confirmed</title><style>${baseStyles()}</style></head>
<body><div class="wrap">
  <p class="eyebrow">ridewithalex · confirmed</p>
  <h1>you're booked, ${b.customerName.split(" ")[0]}.</h1>
  <p>see you on the mountain. here are your details:</p>
  <div class="card">
    <div class="row"><span class="label">when</span><span class="value">${dateRange}</span></div>
    <div class="row"><span class="label">lesson</span><span class="value">${b.lessonType}</span></div>
    ${b.headcount > 1 ? `<div class="row"><span class="label">riders</span><span class="value">${b.headcount}</span></div>` : ""}
    <div class="row"><span class="label">total</span><span class="value">${formatBgn(b.totalStotinki)}</span></div>
    <div class="row"><span class="label">booking ref</span><span class="value">${b.bookingId.slice(0, 8)}</span></div>
  </div>
  <p><strong style="color:#fff;">where to meet:</strong> in front of the bansko gondola, 1 pirin street. i'll be in a black jacket with a green carbon snowboard.</p>
  <p><strong style="color:#fff;">what to bring:</strong> waterproof jacket + pants, thermal layer, gloves, helmet, goggles. no cotton. i can help you sort rentals + lift pass if needed.</p>
  <p><strong style="color:#fff;">payment:</strong> cash on the day — bulgarian leva or euros. no online deposit.</p>
  <p>i'll call or message you to confirm. questions? reply to this email or text +359 88 513 7471.</p>
  <p class="footer">ridewithalex.com · bansko, bulgaria</p>
</div></body></html>`;
}

function renderAlexHtml(b: BookingForEmail): string {
  const dateRange = formatDateRange(b.startsAt, b.endsAt);
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>New booking</title><style>${baseStyles()}</style></head>
<body><div class="wrap">
  <p class="eyebrow">ridewithalex · new booking</p>
  <h1>new booking — ${b.customerName}</h1>
  <div class="card">
    <div class="row"><span class="label">when</span><span class="value">${dateRange}</span></div>
    <div class="row"><span class="label">customer</span><span class="value">${b.customerName}</span></div>
    <div class="row"><span class="label">phone</span><span class="value"><a href="tel:${b.customerPhone}">${b.customerPhone}</a></span></div>
    ${b.customerEmail ? `<div class="row"><span class="label">email</span><span class="value"><a href="mailto:${b.customerEmail}">${b.customerEmail}</a></span></div>` : ""}
    <div class="row"><span class="label">lesson</span><span class="value">${b.lessonType}</span></div>
    <div class="row"><span class="label">riders</span><span class="value">${b.headcount}</span></div>
    <div class="row"><span class="label">total</span><span class="value">${formatBgn(b.totalStotinki)}</span></div>
    ${b.notes ? `<div class="row"><span class="label">notes</span><span class="value">${b.notes}</span></div>` : ""}
    <div class="row"><span class="label">ref</span><span class="value">${b.bookingId.slice(0, 8)}</span></div>
  </div>
  <p>calendar event was auto-created in your google calendar.</p>
  <p class="footer">ridewithalex.com admin</p>
</div></body></html>`;
}

export async function sendCustomerConfirmation(b: BookingForEmail): Promise<void> {
  if (!b.customerEmail) return;
  const resend = getResend();
  const result = await resend.emails.send({
    from: getFromAddress(),
    to: b.customerEmail,
    subject: `booking confirmed · ${DATE_FMT.format(b.startsAt).toLowerCase()}`,
    html: renderCustomerHtml(b),
  });
  if (result.error) {
    const message = result.error.message ?? "";
    if (message.includes("testing emails")) {
      console.warn(
        `[resend] customer email skipped — sandbox mode (verify a domain at resend.com/domains to send to ${b.customerEmail})`,
      );
      return;
    }
    throw new Error(`customer email failed: ${result.error.message}`);
  }
}

export async function sendAlexNotification(b: BookingForEmail): Promise<void> {
  const resend = getResend();
  const result = await resend.emails.send({
    from: getFromAddress(),
    to: getAlexAddress(),
    subject: `new booking · ${b.customerName} · ${DATE_FMT.format(b.startsAt).toLowerCase()}`,
    html: renderAlexHtml(b),
  });
  if (result.error) {
    throw new Error(`alex email failed: ${result.error.message}`);
  }
}
