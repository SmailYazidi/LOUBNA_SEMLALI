import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";

const BLOB_TOKEN = process.env.VERCEL_BLOB_TOKEN!;
const container = "my-container"; // غيّر هذا باسم الكونتينر الخاص بك

export async function GET() {
  try {
    const db = await connectDB();
    const cv = await db.collection("cv").findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(cv || {});
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const db = await connectDB();
    const cvCollection = db.collection("cv");
    const currentCv = await cvCollection.findOne({});

    const updatedCv: Record<string, string> = {};

    for (const lang of ["fr", "en"]) {
      const file = formData.get(lang) as File | null;
      if (file) {
        // حذف القديم
        if (currentCv && currentCv[lang]) {
          try {
            const oldPath = new URL(currentCv[lang]).pathname;
            const key = oldPath.split("/").pop()!;
            await del(container, key, { accessToken: BLOB_TOKEN });
          } catch (err) {
            console.warn(`Failed to delete old ${lang} CV:`, err);
          }
        }

        // رفع الجديد
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = `${Date.now()}_${file.name}`;
        const uploadRes = await put(container, key, buffer, {
          accessToken: BLOB_TOKEN,
          contentType: "application/pdf",
        });

        updatedCv[lang] = uploadRes.url;
      }
    }

    // دمج البيانات القديمة والجديدة
    const newCvData = { ...currentCv, ...updatedCv };

    // تحديث أو إضافة السجل
    await cvCollection.updateOne({}, { $set: newCvData }, { upsert: true });

    return NextResponse.json(newCvData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update CVs" }, { status: 500 });
  }
}
