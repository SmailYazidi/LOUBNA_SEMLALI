import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");

    // Get the first document
    const contactData = await contactCollection.findOne({});
    
    // Return default structure if no data exists
    if (!contactData) {
      return NextResponse.json({
        contactTitle: { fr: "", en: "" },
        contactDescription: { fr: "", en: "" },
        contactInfo: [],
        contactButton: {
          startProject: { fr: "", en: "" },
          link: ""
        }
      });
    }
    
    return NextResponse.json(contactData);
  } catch (error) {
    console.error("Error fetching Contact:", error);
    return NextResponse.json(
      { message: "Failed to fetch Contact" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");

    const data = await req.json();

    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { message: "Invalid data format" }, 
        { status: 400 }
      );
    }

    // Ensure required fields exist with default values
    const validatedData = {
      contactTitle: data.contactTitle || { fr: "", en: "" },
      contactDescription: data.contactDescription || { fr: "", en: "" },
      contactInfo: Array.isArray(data.contactInfo) ? data.contactInfo : [],
      contactButton: {
        startProject: data.contactButton?.startProject || { fr: "", en: "" },
        link: data.contactButton?.link || ""
      },
      updatedAt: new Date()
    };

    // Update the first document or insert if none exists
    const result = await contactCollection.replaceOne(
      {}, 
      validatedData, 
      { upsert: true }
    );

    return NextResponse.json({ 
      message: "Contact updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error("Error updating Contact:", error);
    return NextResponse.json(
      { message: "Failed to update Contact" }, 
      { status: 500 }
    );
  }
}