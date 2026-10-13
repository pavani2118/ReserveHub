
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
  reservationSchema,
} from "@/lib/validators/reservation";

import {
  createReservation,
  ReservationBusinessError,
} from "@/services/reservation.service";

// ========================================
// POST - Create New Reservation
// ========================================

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // 2. Verify user exists in database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user session",
        },
        { status: 401 }
      );
    }

    // 3. Parse request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request",
        },
        { status: 400 }
      );
    }

    // 4. Validate reservation data
    const validated = reservationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message ??
            "Invalid reservation details",
        },
        { status: 400 }
      );
    }

    // 5. Create reservation
    const reservation = await createReservation(
      user.id,
      validated.data
    );

    // 6. Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Reservation created successfully",
        reservation: {
          id: reservation.id,
          status: reservation.status,
          resourceId: reservation.resourceId,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
        },
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Handle business errors
    if (error instanceof ReservationBusinessError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    console.error("Reservation API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create reservation",
      },
      { status: 500 }
    );
  }
}
