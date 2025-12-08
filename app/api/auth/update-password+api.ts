import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase URL or Service Key");
}

// Create a server-side client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request): Promise<Response> {
  try {
    const { password, access_token, refresh_token } = await request.json();
    
    console.log("Update password API called");
    console.log("Has password:", !!password);
    console.log("Has access_token:", !!access_token);
    console.log("Has refresh_token:", !!refresh_token);

    if (!password || !access_token || !refresh_token) {
      return Response.json(
        { error: { message: "Missing required parameters" } },
        { status: 400 }
      );
    }


    
    // Set the session using the provided tokens
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError || !sessionData.session) {
      console.error("Failed to set session:", sessionError);
      return Response.json(
        { error: { message: "Invalid or expired recovery session" } },
        { status: 401 }
      );
    }

    console.log("Session set successfully for user:", sessionData.session.user.id);

    // Update the user's password
    const { data, error } = await supabaseAdmin.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password update error:", error);
      return Response.json(
        { error: { message: error.message } },
        { status: 400 }
      );
    }

    console.log("Password updated successfully");
    return Response.json({ 
      success: true, 
      message: "Password updated successfully",
      user: data.user 
    });

  } catch (error) {
    console.error("Update password API error:", error);
    return Response.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
