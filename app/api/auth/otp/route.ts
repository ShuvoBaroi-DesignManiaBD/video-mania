import { HTTP_STATUS } from "@/lib/server/constants";
import supabase from "@/lib/supabase";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  if (email.startsWith(".") || email.endsWith(".")) return false;
  if (email.includes("..")) return false;
  return true;
}

export async function POST(req: Request) {
  try {
    const urlOk = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    );
    const keyOk = !!(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );
    console.log("[api/auth/otp] env check - urlOk:", urlOk, "keyOk:", keyOk);
    if (!urlOk || !keyOk) {
      const traceId = crypto.randomUUID();
      console.log(
        JSON.stringify({
          type: "otp_send_error",
          traceId,
          code: "config_missing",
          message: "Supabase configuration missing",
          timestamp: Date.now(),
        })
      );
      return Response.json(
        {
          accepted: false,
          traceId,
          error: {
            code: "config_missing",
            message: "Email service is not configured",
          },
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const email = normalizeEmail(rawEmail);
    console.log("[api/auth/otp] received email:", email);
    if (!isValidEmail(email)) {
      console.log("[api/auth/otp] invalid email format");
      return Response.json(
        {
          accepted: false,
          error: { code: "invalid_email", message: "Invalid email address" },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const traceId = crypto.randomUUID();
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");
    const origin =
      (typeof body.redirectOrigin === "string"
        ? body.redirectOrigin
        : undefined) ||
      req.headers.get("origin") ||
      undefined;

    console.log(
      JSON.stringify({
        type: "otp_send_start",
        traceId,
        emailHash,
        timestamp: Date.now(),
      })
    );

    console.log("[api/auth/otp] calling supabase.auth.signInWithOtp with", {
      email,
      origin,
    });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: origin ? `${origin.replace(/\/$/, "")}/` : undefined,
      },
    });

    if (error) {
      console.log("[api/auth/otp] supabase error", error);
      console.log(
        JSON.stringify({
          type: "otp_send_error",
          traceId,
          emailHash,
          code: (error as any).code || "unknown",
          message: error.message,
          timestamp: Date.now(),
        })
      );
      return Response.json(
        {
          accepted: false,
          traceId,
          error: {
            code: (error as any).code || "unknown",
            message: error.message,
          },
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    console.log("[api/auth/otp] supabase success");
    console.log(
      JSON.stringify({
        type: "otp_send_ack",
        traceId,
        emailHash,
        timestamp: Date.now(),
      })
    );
    return Response.json(
      { accepted: true, traceId },
      { status: HTTP_STATUS.OK }
    );
  } catch (e: any) {
    const traceId = crypto.randomUUID();
    console.log("[api/auth/otp] exception", e);
    console.log(
      JSON.stringify({
        type: "otp_send_exception",
        traceId,
        message: e?.message || "Unknown error",
        timestamp: Date.now(),
      })
    );
    return Response.json(
      {
        accepted: false,
        traceId,
        error: {
          code: "exception",
          message: e?.message || "Failed to send OTP",
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
