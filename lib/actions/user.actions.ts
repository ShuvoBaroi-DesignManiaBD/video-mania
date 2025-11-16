"use client";

import supabase from "@/lib/supabase";

// Client-side auth helpers using Supabase
// Replaces Appwrite-based server actions

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const normalized = email.trim().toLowerCase();
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, redirectOrigin: origin }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        accountId: null,
        error: friendlyError(
          data?.error?.message || `Failed to send OTP: ${res.status}`
        ),
      };
    }

    const data = await res.json();
    if (!data?.accepted) {
      return {
        accountId: null,
        error: friendlyError(data?.error?.message || "Failed to send OTP"),
      };
    }

    // For OTP code entry flow, we return success and show modal to verify
    return { accountId: "otp", error: null };
  } catch (error: any) {
    console.log("[signInUser] exception:", error);
    return {
      accountId: null,
      error: error?.message || "Failed to sign in user",
    };
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const normalized = email.trim().toLowerCase();
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, redirectOrigin: origin }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        accountId: null,
        error: friendlyError(
          data?.error?.message || `Failed to send OTP: ${res.status}`
        ),
      };
    }

    const data = await res.json();
    if (!data?.accepted) {
      return {
        accountId: null,
        error: friendlyError(data?.error?.message || "Failed to send OTP"),
      };
    }

    return { accountId: "otp", error: null };
  } catch (error: any) {
    console.log("[createAccount] exception:", error);
    return {
      accountId: null,
      error: error?.message || "Failed to create account",
    };
  }
};

export const verifyEmailOtp = async ({
  email,
  token,
  fullName,
}: {
  email: string;
  token: string;
  fullName?: string;
}) => {
  console.log("[verifyEmailOtp] verifying", { email, token, fullName });
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) throw error;

    // Optionally update user metadata with fullName after verifying
    if (fullName) {
      await supabase.auth.updateUser({ data: { fullName } });
    }

    console.log("[verifyEmailOtp] success", data.user);
    return { user: data.user };
  } catch (error: any) {
    console.log("[verifyEmailOtp] error", error);
    return { error: error?.message || "Failed to verify OTP" };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to sign out user",
    };
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  console.log("[sendEmailOTP] starting with email:", email);
  try {
    const normalized = email.trim().toLowerCase();
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    console.log("[sendEmailOTP] normalized email:", normalized);
    console.log("[sendEmailOTP] origin:", origin);
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, redirectOrigin: origin }),
    });
    console.log("[sendEmailOTP] fetch response status:", res.status);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.log("[sendEmailOTP] fetch error data:", data);
      return {
        success: false,
        error: friendlyError(
          data?.error?.message || `Failed to send OTP: ${res.status}`
        ),
      };
    }
    const data = await res.json();
    console.log("[sendEmailOTP] fetch success data:", data);
    if (!data?.accepted) {
      return {
        success: false,
        error: friendlyError(data?.error?.message || "Failed to send OTP"),
      };
    }

    return { success: true };
  } catch (error: any) {
    console.log("[sendEmailOTP] exception:", error);
    return { success: false, error: error?.message || "Failed to send OTP" };
  }
};

export const verifySecret = async ({
  accountId,
  password,
  email,
}: {
  accountId: string;
  password: string;
  email: string;
}) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: password,
      type: "email",
    });

    if (error) throw error;

    // Return a truthy session identifier compatible with existing OTPModal check
    return data.session?.access_token || data.user?.id || "ok";
  } catch (error: any) {
    return null;
  }
};

// Aliases to satisfy possible alternative imports
export const sendEmailOtp = async ({ email }: { email: string }) =>
  sendEmailOTP({ email });
export const verySecret = async ({
  accountId,
  password,
  email,
}: {
  accountId: string;
  password: string;
  email: string;
}) => verifySecret({ accountId, password, email });

function friendlyError(message: string): string {
  const msg = String(message).toLowerCase();
  if (msg.includes("invalid email")) return "Enter a valid email address";
  if (msg.includes("rate") && msg.includes("limit"))
    return "Too many requests. Please wait and try again";
  if (msg.includes("smtp") || msg.includes("provider") || msg.includes("configuration"))
    return "Email service is not configured. Please contact support";
  if (msg.includes("redirect") && msg.includes("url"))
    return "Redirect URL is not allowed. Please try again later";
  return String(message);
}