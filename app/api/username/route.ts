// app/api/username/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const username = await db.collection("username").findOne({});
    
    return NextResponse.json({
      name: username?.name || null,
    });
    
  } catch (error) {
    console.error("Username GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch username" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Valid name is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    // Store or update the single username document
    await db.collection("username").updateOne(
      {}, // Empty filter matches the first document (or creates if none exists)
      { $set: { name } },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Username updated successfully" }
    );

  } catch (error) {
    console.error("Username POST error:", error);
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const db = await connectDB();
    await db.collection("username").deleteOne({});
    
    return NextResponse.json(
      { success: true, message: "Username deleted successfully" }
    );
    
  } catch (error) {
    console.error("Username DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete username" },
      { status: 500 }
    );
  }
}