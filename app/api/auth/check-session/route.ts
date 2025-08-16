import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("--- Starting session check ---");
  console.log("Incoming request headers:", request.headers);
  
  try {
    // 1. Get token from cookies
    const cookies = request.cookies.getAll();
    console.log("All cookies received:", cookies);
    
    const token = request.cookies.get("session_token")?.value;
    console.log("Session token extracted:", token ? `${token.slice(0, 10)}...${token.slice(-5)}` : "None");
    
    if (!token) {
      console.log("No session token found in cookies");
      return NextResponse.json(
        { error: "No session token" },
        { status: 401 }
      );
    }

    // 2. Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    console.log("JWT secret configured:", !!process.env.JWT_SECRET);
    
    try {
      console.log("Attempting to verify JWT...");
      const { payload } = await jwtVerify(token, secret);
      console.log("JWT verification successful. Payload:", {
        userId: payload.userId,
        iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
        exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
      });
      
      // 3. Check session in database
      console.log("Connecting to database...");
      const db = await connectDB();
      console.log("Database connection established");
      
      console.log("Querying session for token and userId...");
      const session = await db.collection("sessions").findOne({ 
        token,
        userId: payload.userId 
      });
      
      if (!session) {
        console.log("Session not found in database");
        return NextResponse.json(
          { error: "Session not found" },
          { status: 401 }
        );
      }

      console.log("Session found in database. Session details:", {
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        currentTime: new Date().toISOString()
      });

      console.log("Session check completed successfully");
      return NextResponse.json(
        { success: true, user: payload },
        { status: 200 }
      );

    } catch (error) {
      // Handle JWT verification errors (including expired)
      console.error("JWT verification failed:", error);
      
      console.log("Connecting to database to clean up invalid session...");
      const db = await connectDB();
      const deleteResult = await db.collection("sessions").deleteOne({ token });
      console.log("Session deletion result:", deleteResult);
      
      // Clear the invalid cookie
      const response = NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
      response.cookies.delete("session_token");
      console.log("Invalid session token cleared from cookies");
      
      return response;
    }

  } catch (error) {
    console.error("Unexpected error during session check:", error);
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401 }
    );
  } finally {
    console.log("--- Session check process completed ---");
  }
}