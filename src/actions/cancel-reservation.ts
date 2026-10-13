
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CancelState = {
  ok: boolean;
  message: string;
};

export async function cancelReservationAction(
  reservationId: string,
  _previousState: CancelState,
  _formData: FormData
): Promise<CancelState> {
  void _previousState;
  void _formData;
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      message: "Please sign in to continue.",
    };
  }

  const parsed = z.uuid().safeParse(reservationId);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid reservation ID.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!user) {
    return {
      ok: false,
      message: "Account not found.",
    };
  }

  try {
    const result = await prisma.reservation.updateMany({
      where: {
        id: parsed.data,
        status: "CONFIRMED",

        ...(user.role === "ADMIN"
          ? {}
          : { userId: user.id }),
      },

      data: {
        status: "CANCELLED",
      },
    });

    if (result.count === 0) {
      return {
        ok: false,
        message:
          "Reservation not found, already cancelled, or access denied.",
      };
    }

    revalidatePath("/reservations");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Reservation cancelled successfully.",
    };
  } catch (error) {
    console.error("Cancellation failed:", error);

    return {
      ok: false,
      message: "Unable to cancel reservation.",
    };
  }
}
