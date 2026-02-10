import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.userId),
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // If user is in a group, fetch group info
    let group = null
    if (user.groupId) {
      const groupDoc = await db.collection("groups").findOne({
        _id: new ObjectId(user.groupId),
      })
      if (groupDoc) {
        group = {
          id: groupDoc._id.toString(),
          name: groupDoc.name,
          code: groupDoc.code,
          coachId: groupDoc.coachId,
        }
      }
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role || "athlete",
        groupId: user.groupId || null,
        group,
        profileComplete: user.profileComplete,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
