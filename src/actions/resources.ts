
"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { resourceSchema } from "@/lib/validators/resource";
import { createResource } from "@/services/resource.service";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function createResourceAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Only administrators can create resources
  await requireAdmin();

  const validated = resourceSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    capacity: formData.get("capacity"),
    description: formData.get("description"),
  });

  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ||
        "Invalid resource information.",
    };
  }

  try {
    await createResource(validated.data);

    revalidatePath("/resources");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Resource created successfully!",
    };
  } catch (error) {
    console.error("Resource creation failed:", error);

    return {
      ok: false,
      message: "Unable to create resource. Please try again.",
    };
  }
}
