-- Rename total_stotinki column to total_cents (pricing switch BGN → EUR, s16).
-- Column now stores EUR cents instead of BGN stotinki. Values remain as-is;
-- any rows predating the switch had BGN values and should be re-priced
-- manually (delete the old test booking in s16 to avoid confusion).

ALTER TABLE "bookings" RENAME COLUMN "total_stotinki" TO "total_cents";
