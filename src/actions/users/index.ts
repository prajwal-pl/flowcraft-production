"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const addUser = async (userData: {
  name: string;
  email: string;
  clerkId: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const user = await db.user.create({
      data: {
        ...userData,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
