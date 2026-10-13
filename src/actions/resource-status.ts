
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { setResourceActive } from "@/services/resource.service";

const statusSchema = z.object({
  id: z.uuid(),
  isActive: z.enum(["true", "false"]),
});

export async function setResourceStatusAction(
  formData: FormData
) {
  await requireAdmin();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    throw new Error("Invalid resource information");
  }

  await setResourceActive(
    parsed.data.id,
    parsed.data.isActive === "true"
  );

  revalidatePath("/resources");
  revalidatePath("/dashboard");
}
