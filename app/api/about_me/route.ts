import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const aboutCollection = db.collection("about");

    // Get the first document
    const aboutData = await aboutCollection.findOne({});
    return NextResponse.json(aboutData || null);
  } catch (error) {
    console.error("Error fetching About Me:", error);
    return NextResponse.json({ message: "Failed to fetch About Me" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = await connectDB();
    const aboutCollection = db.collection("about");

    const data = await req.json();

    // Update the first document or insert if none
    const result = await aboutCollection.updateOne({}, { $set: data }, { upsert: true });
    return NextResponse.json({ message: "About Me updated successfully" });
  } catch (error) {
    console.error("Error updating About Me:", error);
    return NextResponse.json({ message: "Failed to update About Me" }, { status: 500 });
  }
}
