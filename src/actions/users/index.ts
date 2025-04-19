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

export const updateUserProfile = async (userData: {
  bio?: string;
  name?: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    // Find user by Clerk ID
    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update user profile information
    const updatedUser = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        name: userData.name || user.name,
        ...userData,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserPreferences = async (preferences: {
  theme?: "light" | "dark" | "system";
  reducedMotion?: boolean;
  emailNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update user preferences
    const updatedUser = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        ...preferences,
        lastActive: new Date(), // Update last active timestamp
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};
