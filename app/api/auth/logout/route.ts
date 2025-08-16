import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  const res = NextResponse.json({ success: true });
  res.cookies.set("session_token", "", { httpOnly: true, path: "/", maxAge: 0 });

  if (token) {
    try {
      const db = await connectDB();
      await db.collection("sessions").deleteOne({ token });
    } catch (_) {
      // ignore
    }
  }

  return res;
}