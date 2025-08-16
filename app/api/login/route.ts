import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const db = await connectDB();

    // 1. Get hashed password from adminpassword collection
    const adminPassword = await db.collection("adminpassword").findOne({});
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, adminPassword.hashedPassword);
    
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Create session token (JWT)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds
    
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiresIn)
      .sign(secret);

    // 4. Store session in database
    const session = await db.collection("sessions").insertOne({
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    });

    // 5. Set secure HTTP-only cookie
    cookies().set({
      name: "session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + expiresIn * 1000),
    });

    return NextResponse.json(
      { success: true, redirectUrl: "/admin" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}