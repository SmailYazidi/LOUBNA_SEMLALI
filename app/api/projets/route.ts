import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";
import { ObjectId } from "mongodb";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN!;

export async function GET() {
  try {
    const db = await connectDB();
    const projets = await db.collection("projets").findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(projets || {});
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("_id") as string | null;
    const titleFr = formData.get("title.fr") as string;
    const titleEn = formData.get("title.en") as string;
    const descriptionFr = formData.get("description.fr") as string;
    const descriptionEn = formData.get("description.en") as string;
    const techStack = JSON.parse(formData.get("techStack") as string); // Array of strings
    const button = JSON.parse(formData.get("button") as string);
    const link = formData.get("link") as string;

    const file = formData.get("image") as File | null;

    const db = await connectDB();
    const projetsCollection = db.collection("projets");

    let currentProject = id ? await projetsCollection.findOne({ _id: new ObjectId(id) }) : null;
    let imageUrl = currentProject?.image || null;

    // If new image uploaded
    if (file) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
      }

      // Delete old file if exists
      if (currentProject?.image) {
        try {
          const oldUrl = new URL(currentProject.image);
          const pathParts = oldUrl.pathname.split("/").filter(Boolean);
          if (pathParts.length > 0) {
            const oldKey = pathParts[pathParts.length - 1];
            await del(oldKey, { token: BLOB_TOKEN });
            console.log(`Deleted old image: ${oldKey}`);
          }
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // Upload new one
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const cleanName = file.name.replace(/\s+/g, "_").replace(/\//g, "-");
      const key = `project_${timestamp}_${cleanName}`;

      const uploadRes = await put(key, buffer, {
        token: BLOB_TOKEN,
        contentType: file.type,
        access: "public",
        addRandomSuffix: false,
      });

      imageUrl = uploadRes.url;
    }

    const newProject = {
      title: { fr: titleFr, en: titleEn },
      description: { fr: descriptionFr, en: descriptionEn },
      techStack,
      button,
      link,
      image: imageUrl,
      updatedAt: new Date(),
    };

    if (id) {
      await projetsCollection.updateOne({ _id: new ObjectId(id) }, { $set: newProject });
    } else {
      newProject["createdAt"] = new Date();
      await projetsCollection.insertOne(newProject);
    }

    return NextResponse.json(newProject);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message || "Failed to save project" }, { status: 500 });
  }
}
