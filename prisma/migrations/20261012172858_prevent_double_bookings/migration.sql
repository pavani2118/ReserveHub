
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Reservation"
ADD CONSTRAINT "reservation_valid_time"
CHECK ("endTime" > "startTime");

ALTER TABLE "Reservation"
ADD CONSTRAINT "reservation_prevent_overlap"
EXCLUDE USING GIST (
  "resourceId" WITH =,
  tstzrange("startTime", "endTime", '[)') WITH &&
)
WHERE ("status" = 'CONFIRMED'::"ReservationStatus");
