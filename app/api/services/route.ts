import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const services = await db.collection("services").findOne({});
    return NextResponse.json(services || { servicesList: [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const db = await connectDB();
    await db.collection("services").updateOne({}, { $set: data }, { upsert: true });
    return NextResponse.json({ message: "Services updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update services" }, { status: 500 });
  }
}
