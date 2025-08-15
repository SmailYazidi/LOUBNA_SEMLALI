import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET() {
  try {
    const db = await connectDB();
    const skills = await db.collection("skills").findOne({});
    return NextResponse.json(skills || { skillsTitle: { fr: "", en: "" }, skills: [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
// app/api/skills/route.ts
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const db = await connectDB();

    // Remove _id from the data if it exists
    const { _id, ...updateData } = data;

    // Find the existing document to get its _id
    const existingDoc = await db.collection("skills").findOne({});
    
    let result;
    if (existingDoc) {
      // Update existing document
      result = await db.collection("skills").updateOne(
        { _id: existingDoc._id },
        { $set: updateData }
      );
    } else {
      // Insert new document
      result = await db.collection("skills").insertOne(updateData);
    }

    return NextResponse.json({
      success: true,
      message: "Skills updated successfully",
      result
    });
  } catch (err: any) {
    console.error("Update error:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to update skills",
      message: err.message
    }, { status: 500 });
  }
}