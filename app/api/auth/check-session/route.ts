import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    // Log all cookies for debugging
    console.log("All cookies:", request.cookies.getAll());

    const token = request.cookies.get("session_token")?.value;
    if (!token) {
      console.log("No session token found in cookies");
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);
    console.log("Decoded JWT payload:", payload);

    const userId = (payload as any).uid;
    if (!userId) {
      console.log("Invalid token: no uid in payload");
      const r = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      r.cookies.delete("session_token");
      return r;
    }

    const db = await connectDB();
    const session = await db.collection("sessions").findOne({ token, userId });

    if (!session) {
      console.log("Session not found in database");
      const r = NextResponse.json({ error: "Session not found" }, { status: 401 });
      r.cookies.delete("session_token");
      return r;
    }

    console.log("Session verified successfully for userId:", userId);
    return NextResponse.json({ success: true, userId }, { status: 200 });

  } catch (err: any) {
    console.error("JWT verification or session error:", err.message || err);
    const r = NextResponse.json({ error: "Session expired" }, { status: 401 });
    r.cookies.delete("session_token");
    return r;
  }
}
