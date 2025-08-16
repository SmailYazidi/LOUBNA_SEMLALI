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

    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    // Ensure required fields exist with default values
    const validatedData = {
      aboutTitle: data.aboutTitle || { fr: "", en: "" },
      aboutDescription: data.aboutDescription || { fr: "", en: "" },
      personalInfo: Array.isArray(data.personalInfo) ? data.personalInfo : [],
      languages: {
        title: data.languages?.title || { fr: "Langues", en: "Languages" },
        levels: data.languages?.levels || {
          a1: { fr: "Débutant", en: "Beginner" },
          a2: { fr: "Élémentaire", en: "Elementary" },
          b1: { fr: "Intermédiaire", en: "Intermediate" },
          b2: { fr: "Intermédiaire Avancé", en: "Upper Intermediate" },
          c1: { fr: "Avancé", en: "Advanced" },
          c2: { fr: "Maîtrise", en: "Mastery" },
          native: { fr: "Langue Maternelle", en: "Native" }
        },
        list: Array.isArray(data.languages?.list) ? data.languages.list : []
      },
      interests: Array.isArray(data.interests) ? data.interests : [],
      updatedAt: new Date()
    };

    // Update the first document or insert if none exists
    const result = await aboutCollection.replaceOne(
      {}, 
      validatedData, 
      { upsert: true }
    );

    return NextResponse.json({ 
      message: "About Me updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error("Error updating About Me:", error);
    return NextResponse.json({ message: "Failed to update About Me" }, { status: 500 });
  }
}