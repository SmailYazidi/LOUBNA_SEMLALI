import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN!;
const container = "portfolio-photos";

export async function GET() {
  try {
    const db = await connectDB();
    const photoData = await db.collection("photo").findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(photoData || { url: null });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo") as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const photoCollection = db.collection("photo");
    
    // Get current photo data
    const currentPhoto = await photoCollection.findOne({});
    const updatedPhoto: { url: string | null } = { url: null };

    // Delete old file if exists
    if (currentPhoto?.url) {
      try {
        const oldUrl = new URL(currentPhoto.url);
        // Extract the key from the URL pathname
        const pathParts = oldUrl.pathname.split("/").filter(Boolean);
        
        // The key should be the last part of the path
        if (pathParts.length > 0) {
          const oldKey = pathParts[pathParts.length - 1];
          
          // Construct the full blob URL for deletion
          const blobUrl = `https://blob.vercel-storage.com/${container}/${oldKey}`;
          
          await del(blobUrl, {
            token: BLOB_TOKEN
          });
          console.log(`Successfully deleted old photo: ${blobUrl}`);
        }
      } catch (err) {
        console.error("Failed to delete old photo:", err);
        // Don't fail the whole operation if deletion fails
      }
    }

    // Upload new file
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/\s+/g, '_').replace(/\//g, '-');
    const key = `photo_${timestamp}_${cleanFileName}`;
    
    // Construct the full blob URL for upload
    const blobUrl = `https://blob.vercel-storage.com/${container}/${key}`;
    
    const uploadRes = await put(blobUrl, buffer, {
      token: BLOB_TOKEN,
      contentType: file.type,
      access: 'public'
    });

    updatedPhoto.url = uploadRes.url;

    // Update database
    await photoCollection.updateOne(
      {},
      { $set: updatedPhoto },
      { upsert: true }
    );

    return NextResponse.json(updatedPhoto);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update photo" },
      { status: 500 }
    );
  }
}