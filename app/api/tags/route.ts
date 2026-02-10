import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const tags = await db
      .collection("tags")
      .find({ userId: session.userId })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({
      tags: tags.map((tag) => ({
        id: tag._id.toString(),
        name: tag.name,
      })),
    })
  } catch (error) {
    console.error("Get tags error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
