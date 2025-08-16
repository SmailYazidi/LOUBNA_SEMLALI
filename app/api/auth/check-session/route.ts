import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    // Verify signature & expiry
    const { payload } = await jwtVerify(token, secret);
    const userId = (payload as any).uid;
    if (!userId) {
      const r = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      r.cookies.delete("session_token");
      return r;
    }

    const db = await connectDB();
    const session = await db.collection("sessions").findOne({ token, userId });

    if (!session) {
      const r = NextResponse.json({ error: "Session not found" }, { status: 401 });
      r.cookies.delete("session_token");
      return r;
    }

    return NextResponse.json({ success: true, userId }, { status: 200 });
  } catch (err) {
    // Any verification/expiry error -> clear cookie
    const r = NextResponse.json({ error: "Session expired" }, { status: 401 });
    r.cookies.delete("session_token");
    return r;
  }
}
