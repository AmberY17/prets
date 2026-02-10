import { NextResponse } from "next/server"
import { getSession, createSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { displayName } = await req.json()

    if (!displayName || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters" },
        { status: 400 }
      )
    }

    const db = await getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $set: {
          displayName: displayName.trim(),
          profileComplete: true,
          updatedAt: new Date(),
        },
      }
    )

    await createSession({
      userId: session.userId,
      email: session.email,
      displayName: displayName.trim(),
      role: session.role,
      groupId: session.groupId,
    })

    return NextResponse.json({
      success: true,
      user: {
        displayName: displayName.trim(),
        profileComplete: true,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
