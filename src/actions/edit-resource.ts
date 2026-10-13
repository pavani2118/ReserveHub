
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { resourceSchema } from "@/lib/validators/resource";
import { updateResource } from "@/services/resource.service";

type EditState = {
  error: string;
};

export async function updateResourceAction(
  _previousState: EditState,
  formData: FormData
): Promise<EditState> {
  await requireAdmin();

  const idResult = z.uuid().safeParse(
    formData.get("id")
  );

  const validated = resourceSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    capacity: formData.get("capacity"),
    description: formData.get("description"),
  });

  if (!idResult.success) {
    return { error: "Invalid resource ID." };
  }

  if (!validated.success) {
    return {
      error:
        validated.error.issues[0]?.message ||
        "Invalid resource information.",
    };
  }

  try {
    await updateResource(
      idResult.data,
      validated.data
    );
  } catch (error) {
    console.error("Resource update failed:", error);

    return {
      error: "Unable to update resource.",
    };
  }

  revalidatePath("/resources");
  revalidatePath("/dashboard");

  redirect("/resources");
}
