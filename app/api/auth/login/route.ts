import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  const isProd = process.env.NODE_ENV === "production";

  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const db = await connectDB();
    const admin = await db.collection("adminpassword").findOne({});
    if (!admin || !admin.hashedPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    const valid = await bcrypt.compare(password, admin.hashedPassword);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- Create JWT (24h) ---
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const expiresInSec = 60 * 60 * 24; // 24h
    const nowSec = Math.floor(Date.now() / 1000);
    const exp = nowSec + expiresInSec; // absolute NumericDate (seconds since epoch)

    const token = await new SignJWT({ uid: admin._id.toString() })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(nowSec)
      .setExpirationTime(exp)
      .sign(secret);

    // --- Store session in DB ---
    await db.collection("sessions").insertOne({
      token,
      userId: admin._id,
      createdAt: new Date(),
      expiresAt: new Date(exp * 1000),
    });

    // --- Set HttpOnly cookie ---
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set("session_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: expiresInSec,
      // domain: undefined // let browser infer – works for preview & prod
    });

    return res;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error("/auth/login error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}