import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  const isProd = process.env.NODE_ENV === "production";

  try {
    const { password } = await request.json();
    console.log("Received password:", password ? "******" : "none");

    if (!password) {
      console.log("Password missing in request");
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const db = await connectDB();
    const admin = await db.collection("adminpassword").findOne({});
    console.log("Admin fetched from DB:", admin ? "found" : "not found");

    if (!admin || !admin.hashedPassword) {
      console.log("Admin not configured correctly");
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    const valid = await bcrypt.compare(password, admin.hashedPassword);
    console.log("Password valid:", valid);

    if (!valid) {
      console.log("Invalid credentials provided");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- Create JWT (24h) ---
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const expiresInSec = 60 * 60 * 24; // 24h
    const nowSec = Math.floor(Date.now() / 1000);
    const exp = nowSec + expiresInSec;

    const token = await new SignJWT({ uid: admin._id.toString() })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(nowSec)
      .setExpirationTime(exp)
      .sign(secret);

    console.log("JWT created:", token.slice(0, 20) + "...");

    // --- Store session in DB ---
    await db.collection("sessions").insertOne({
      token,
      userId: admin._id,
      createdAt: new Date(),
      expiresAt: new Date(exp * 1000),
    });
    console.log("Session stored in DB for userId:", admin._id.toString());

    // --- Set HttpOnly cookie ---
    const res = NextResponse.json({ success: true });


res.cookies.set("session_token", token, {
  httpOnly: true,
  secure: true,          // HTTPS في الإنتاج
  sameSite: "lax",       // أو "strict" حسب حاجتك
  path: "/",
  maxAge: expiresInSec,
});


    console.log("session_token cookie set");

    return res;
  } catch (err) {
    console.error("/auth/login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
