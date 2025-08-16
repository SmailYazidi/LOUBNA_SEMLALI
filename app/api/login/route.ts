import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  console.log("--- Starting login process ---");
  console.log("Incoming request headers:", request.headers);
  
  try {
    const requestBody = await request.json();
    console.log("Request body received:", { 
      password: requestBody.password ? "***masked***" : "undefined" 
    });

    const db = await connectDB();
    console.log("Database connected successfully");

    // 1. Verify admin password exists
    console.log("Checking for admin configuration...");
    const admin = await db.collection("adminpassword").findOne({});
    
    if (!admin) {
      console.error("Admin not configured in database");
      return NextResponse.json(
        { error: "Admin not configured" },
        { status: 500 }
      );
    }
    console.log("Admin configuration found");

    // 2. Compare passwords
    console.log("Comparing passwords...");
    const valid = await bcrypt.compare(requestBody.password, admin.hashedPassword);
    
    if (!valid) {
      console.error("Password comparison failed");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    console.log("Password validated successfully");

    // 3. Create JWT token
    console.log("Creating JWT token...");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const expiresIn = 24 * 60 * 60; // 24 hours
    
    const token = await new SignJWT({ userId: admin._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiresIn)
      .sign(secret);

    console.log("JWT token created successfully. Token details:", {
      userId: admin._id,
      expiresIn: `${expiresIn} seconds (${expiresIn/3600} hours)`,
      tokenPreview: `${token.slice(0, 10)}...${token.slice(-5)}`
    });

    // 4. Store session in database
    console.log("Storing session in database...");
    const sessionData = {
      token,
      userId: admin._id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiresIn * 1000)
    };
    
    const insertResult = await db.collection("sessions").insertOne(sessionData);
    console.log("Session stored in database. Insert result:", {
      insertedId: insertResult.insertedId,
      sessionData: {
        ...sessionData,
        expiresAt: sessionData.expiresAt.toISOString()
      }
    });

    // 5. Create response with cookie
    console.log("Preparing response with cookie...");
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Dynamic cookie configuration
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = process.env.VERCEL === "1";
    const domain = isProduction 
      ? (isVercel ? ".vercel.app" : ".yourdomain.com")
      : undefined;

    const cookieOptions = {
      name: "session_token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "strict",
      path: "/",
      maxAge: expiresIn,
      domain: domain
    };

    console.log("Setting cookie with options:", {
      ...cookieOptions,
      value: "***masked***",
      maxAge: `${cookieOptions.maxAge} seconds (${cookieOptions.maxAge/3600} hours)`
    });

    response.cookies.set(cookieOptions);
    console.log("Cookie set successfully in response");

    console.log("Final response headers:", {
      status: 200,
      cookies: response.cookies
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    console.log("--- Login process completed ---");
  }
}