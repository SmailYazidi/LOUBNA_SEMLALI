import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { put, del } from "@vercel/blob"

const BLOB_TOKEN = process.env.VERCEL_BLOB_TOKEN!
const container = "cv-documents" // Use a more specific container name

export async function GET() {
  try {
    const db = await connectDB()
    const cv = await db.collection("cv").findOne({}, { projection: { _id: 0 } })
    return NextResponse.json(cv || { fr: null, en: null })
  } catch (err) {
    console.error("GET error:", err)
    return NextResponse.json(
      { error: "Failed to fetch CVs" }, 
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const db = await connectDB()
    const cvCollection = db.collection("cv")
    
    // Get current CV data
    const currentCv = (await cvCollection.findOne({})) || { fr: null, en: null }
    const updatedCv: Record<string, string | null> = { ...currentCv }

    // Process each language
    for (const lang of ["fr", "en"] as const) {
      const file = formData.get(lang) as File | null
      
      if (file) {
        // Validate file type
        if (file.type !== "application/pdf") {
          throw new Error(`Only PDF files are allowed for ${lang} CV`)
        }

        // Delete old file if exists
        if (currentCv[lang]) {
          try {
            const oldUrl = new URL(currentCv[lang])
            const oldKey = oldUrl.pathname.split("/").pop()!
            await del(container, oldKey, { accessToken: BLOB_TOKEN })
          } catch (err) {
            console.warn(`Failed to delete old ${lang} CV:`, err)
          }
        }

        // Upload new file
        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const key = `${lang}_${timestamp}_${file.name.replace(/\s+/g, '_')}`
        
        const uploadRes = await put(container, key, buffer, {
          accessToken: BLOB_TOKEN,
          contentType: "application/pdf",
          addRandomSuffix: false,
            access: 'public' 
        })

        updatedCv[lang] = uploadRes.url
      }
    }

    // Update database
    await cvCollection.updateOne(
      {},
      { $set: updatedCv },
      { upsert: true }
    )

    return NextResponse.json(updatedCv)
  } catch (err: any) {
    console.error("PUT error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to update CVs" },
      { status: 500 }
    )
  }
}