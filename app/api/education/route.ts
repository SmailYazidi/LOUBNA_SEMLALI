import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const educationData = await db.collection("education").findOne({});
    return NextResponse.json(educationData || { journeyTitle: { fr: "", en: "" }, education: [], experience: [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch education data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const db = await connectDB();
    await db.collection("education").updateOne({}, { $set: data }, { upsert: true });
    return NextResponse.json({ message: "Education data updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update education data" }, { status: 500 });
  }
}
