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

    // Get tags that are actually used in the user's logs
    const usedTags = await db
      .collection("logs")
      .aggregate([
        { $match: { userId: session.userId, tags: { $exists: true, $ne: [] } } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags" } },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    return NextResponse.json({
      tags: usedTags.map((t, i) => ({
        id: `tag-${i}`,
        name: t._id as string,
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
