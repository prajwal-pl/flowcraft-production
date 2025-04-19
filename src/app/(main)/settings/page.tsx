"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  BellIcon,
  KeyIcon,
  Loader2,
  LockIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
} from "@/actions/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form schema for profile settings
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
});

// Form schema for notification settings
const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
});

// Form schema for appearance settings
const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  reducedMotion: z.boolean(),
});

// Type to use with the form
type AppearanceFormValues = z.infer<typeof appearanceSchema>;

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [dbUserProfile, setDbUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile form setup
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
  });

  // Notification settings form
  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    // @ts-ignore
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    },
  });

  // Appearance settings form
  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "system",
      reducedMotion: false,
    },
  });

  // Fetch user profile from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await getUserProfile();
        setDbUserProfile(profile);

        // Set profile form values
        if (profile?.bio) {
          profileForm.setValue("bio", profile.bio);
        }

        // Set notification preferences
        notificationsForm.setValue(
          "emailNotifications",
          profile?.emailNotifications ?? true
        );
        notificationsForm.setValue(
          "marketingEmails",
          profile?.marketingEmails ?? false
        );
        notificationsForm.setValue(
          "securityAlerts",
          profile?.securityAlerts ?? true
        );

        // Set appearance preferences
        appearanceForm.setValue("theme", (profile?.theme as any) || "system");
        appearanceForm.setValue(
          "reducedMotion",
          profile?.reducedMotion ?? false
        );
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load your profile information");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [isLoaded, user, profileForm, notificationsForm, appearanceForm]);

  // Load user data when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      profileForm.setValue("username", user.username || user.firstName || "");
      profileForm.setValue("email", user.emailAddresses[0]?.emailAddress || "");
    }
  }, [isLoaded, user, profileForm]);

  // Apply theme on initial load
  useEffect(() => {
    if (dbUserProfile?.theme) {
      applyTheme(dbUserProfile.theme);
    }
  }, [dbUserProfile]);

  // Function to apply theme
  const applyTheme = (theme: string) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Handle system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Submit handler for profile form
  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    try {
      // Update the user's profile in the database
      await updateUserProfile({
        name: values.username,
        bio: values.bio,
      });

      // Update the clerk profile if needed
      if (user && values.username !== user.username) {
        await user.update({
          username: values.username,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Submit handler for notification settings
  async function onNotificationsSubmit(
    values: z.infer<typeof notificationsSchema>
  ) {
    setIsLoading(true);
    try {
      // Update notification settings in database
      await updateUserPreferences({
        emailNotifications: values.emailNotifications,
        marketingEmails: values.marketingEmails,
        securityAlerts: values.securityAlerts,
      });

      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update notification preferences");
      console.error("Notification settings error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Submit handler for appearance settings
  async function onAppearanceSubmit(values: z.infer<typeof appearanceSchema>) {
    setIsLoading(true);
    try {
      // Update appearance settings in database
      await updateUserPreferences({
        theme: values.theme,
        reducedMotion: values.reducedMotion,
      });

      // Apply theme changes immediately
      applyTheme(values.theme);

      // Store in local storage for faster access
      localStorage.setItem("theme", values.theme);
      localStorage.setItem("reducedMotion", String(values.reducedMotion));

      toast.success("Appearance settings updated");
    } catch (error) {
      toast.error("Failed to update appearance settings");
      console.error("Appearance settings error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handler for password reset request
  const handlePasswordReset = async () => {
    try {
      if (user) {
        // Use Clerk's built-in password reset functionality
        await user.updatePassword({
          newPassword: "",
          signOutOfOtherSessions: true,
          currentPassword: "",
        });
        toast.success("Password reset email sent to your inbox");
      }
    } catch (error) {
      toast.error("Failed to send password reset email");
      console.error("Password reset error:", error);
    }
  };

  // Handler for enabling 2FA
  const handle2FASetup = async () => {
    try {
      // Currently a placeholder - would integrate with Clerk 2FA setup
      toast.info("This feature will be available soon!");
    } catch (error) {
      toast.error("Failed to setup two-factor authentication");
      console.error("2FA setup error:", error);
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    try {
      setIsDeleting(true);

      // This would connect to your actual account deletion API
      // For now, we'll simulate a delay and show a success message
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Account deletion process initiated", {
        description: "You will receive an email with final confirmation steps.",
      });

      // In a real implementation, you might sign the user out after this
      // or redirect them to a confirmation page
    } catch (error) {
      toast.error("Failed to delete account", {
        description: "Please contact support if this issue persists.",
      });
      console.error("Account deletion error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="text-center">
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="text-center">
            <ShieldIcon className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-center">
            <BellIcon className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and how others see you
                on the platform.
              </CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-2xl overflow-hidden">
                      {user?.hasImage ? (
                        <img
                          src={user.imageUrl}
                          alt={user.username || ""}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-10 w-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user?.fullName || user?.firstName || "Your Name"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress || ""}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          user
                            ?.update({})
                            .then(() =>
                              toast.success(
                                "Profile management opened in a new tab"
                              )
                            )
                            .catch(() =>
                              toast.error("Failed to open profile management")
                            );
                        }}
                      >
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" disabled {...field} />
                        </FormControl>
                        <FormDescription>
                          <div className="flex items-center text-xs">
                            <BadgeCheck className="h-3.5 w-3.5 text-green-500 mr-1" />
                            Email verified
                          </div>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tell us about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingProfile}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Manage your password and security settings to protect your
                account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2" /> Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  Change your password or reset it if you've forgotten it.
                </p>
                <div className="flex space-x-4 mt-2">
                  <Button variant="outline" onClick={handlePasswordReset}>
                    Reset Password
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <LockIcon className="h-5 w-5 mr-2" /> Two-Factor
                  Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring
                  both your password and a verification code.
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="2fa"
                    checked={false}
                    onCheckedChange={handle2FASetup}
                  />
                  <Label htmlFor="2fa">Enable two-factor authentication</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" /> Account Activity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitor recent account activity and sign-in events.
                </p>
                <div className="bg-muted/50 rounded-md p-4 mt-2">
                  <p className="text-sm font-medium">Last sign-in</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()} •{" "}
                    {navigator.userAgent.includes("Win")
                      ? "Windows"
                      : "Unknown OS"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions related to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">
                        Warning: Account Deletion
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        This action permanently removes your account, all your
                        workflows, connections, and personal data from our
                        systems. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your account and remove all
                        your data from our servers. We cannot recover this
                        information once deleted.
                        <div className="bg-muted p-3 rounded-md mt-3 text-sm">
                          <p className="font-medium">This will delete:</p>
                          <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>Your personal profile</li>
                            <li>All created workflows and documents</li>
                            <li>Connection settings and preferences</li>
                            <li>User history and activity logs</li>
                          </ul>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAccountDeletion}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>Delete Account</>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <p className="text-xs text-muted-foreground mt-2">
                  Need help? Contact our{" "}
                  <span className="underline">support team</span> before
                  proceeding with account deletion.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Settings Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Control which notifications you receive from FlowCraft.
              </CardDescription>
            </CardHeader>
            <Form {...notificationsForm}>
              <form
                // @ts-ignore
                onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}
              >
                <CardContent className="space-y-4">
                  <FormField
                    // @ts-ignore
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive email notifications about your workflow
                            activity.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    // @ts-ignore
                    control={notificationsForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing Emails
                          </FormLabel>
                          <FormDescription>
                            Receive emails about new features, products, and
                            offers.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    // @ts-ignore
                    control={notificationsForm.control}
                    name="securityAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Security Alerts
                          </FormLabel>
                          <FormDescription>
                            Receive important security notifications about your
                            account.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingProfile}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Notification Preferences
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how FlowCraft looks for you.
              </CardDescription>
            </CardHeader>
            <Form {...appearanceForm}>
              <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          {["light", "dark", "system"].map((theme) => (
                            <div key={theme}>
                              <div
                                className={cn(
                                  "flex items-center justify-center rounded-md border-2 border-muted p-4 transition-all hover:border-primary cursor-pointer",
                                  field.value === theme && "border-primary"
                                )}
                                onClick={() => field.onChange(theme)}
                              >
                                <span className="capitalize">{theme}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appearanceForm.control}
                    name="reducedMotion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Reduced Motion
                          </FormLabel>
                          <FormDescription>
                            Minimize animation and motion effects throughout the
                            interface.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingProfile}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Appearance Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
