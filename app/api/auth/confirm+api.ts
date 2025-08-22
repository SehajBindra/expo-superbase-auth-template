import { supabase } from "@/lib/supabase";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    console.log("Confirm endpoint called with:", url);
    
    const token_hash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type") as EmailOtpType | null;
    const redirectUrl = url.searchParams.get("redirectUrl") || "/auth/update-password";

    console.log("Confirm endpoint called with:", {
      token_hash: !!token_hash,
      type,
      redirectUrl,
    });

    if (!token_hash || !type) {
      console.error("Missing token_hash or type");
      return Response.redirect(
        new URL("/auth?error=missing_parameters", request.url)
      );
    }

    // Verify the OTP token
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("OTP verification failed:", error);
      return Response.redirect(
        new URL("/auth?error=invalid_token", request.url)
      );
    }

    if (!data.user) {
      console.error("No user found after OTP verification");
      return Response.redirect(
        new URL("/auth?error=user_not_found", request.url)
      );
    }

    console.log("OTP verification successful for user:", data.user.id);
    console.log("OTP type:", type);

    // Log the successful verification (cookie handling will be done in redirect)
    console.log("OTP verification successful, preparing redirect with auth cookie");

    // Create a session for the user
    const session = data.session;
    if (!session) {
      console.error("No session created after OTP verification");
      return Response.redirect(
        new URL("/auth?error=session_failed", request.url)
      );
    }

    // Pass tokens to the client (following Reddit solution)
    const { access_token, refresh_token } = session;
    const baseUrl = new URL(request.url).origin;
    const updatePasswordUrl = new URL(redirectUrl, baseUrl);
    updatePasswordUrl.searchParams.set("access_token", access_token);
    updatePasswordUrl.searchParams.set("refresh_token", refresh_token);

    console.log("Redirecting to:", updatePasswordUrl.href);
    return Response.redirect(updatePasswordUrl);
  } catch (error) {
    console.error("Confirm endpoint error:", error);
    return Response.redirect(new URL("/auth?error=server_error", request.url));
  }
}