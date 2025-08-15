// /app/api/hero/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    // Get the first hero document
    const heroData = await heroCollection.findOne({});
    if (!heroData) {
      return NextResponse.json({ message: "Hero data not found" }, { status: 404 });
    }

    const { _id, ...data } = heroData;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch hero data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    const newHero = await request.json();

    // Insert the new hero document
    const result = await heroCollection.insertOne(newHero);

    return NextResponse.json({ message: "Hero added successfully", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to add hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    const updatedHero = await request.json();

    // Update the first hero document (or you can filter by some id)
    const result = await heroCollection.updateOne({}, { $set: updatedHero });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Hero not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Hero updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    // Delete the first hero document
    const result = await heroCollection.deleteOne({});

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Hero not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Hero deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
