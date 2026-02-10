import { NextResponse } from "next/server"
import { getSession, createSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// POST: create a group (coach only) or join a group (any user)
export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body
    const db = await getDb()

    if (action === "create") {
      // Verify user is a coach
      const user = await db.collection("users").findOne({
        _id: new ObjectId(session.userId),
      })
      if (!user || user.role !== "coach") {
        return NextResponse.json(
          { error: "Only coaches can create groups" },
          { status: 403 }
        )
      }

      const { name } = body
      if (!name || name.trim().length < 2) {
        return NextResponse.json(
          { error: "Group name must be at least 2 characters" },
          { status: 400 }
        )
      }

      let code = generateCode()
      // Ensure uniqueness
      let existing = await db.collection("groups").findOne({ code })
      while (existing) {
        code = generateCode()
        existing = await db.collection("groups").findOne({ code })
      }

      const result = await db.collection("groups").insertOne({
        name: name.trim(),
        code,
        coachId: session.userId,
        createdAt: new Date(),
      })

      const groupId = result.insertedId.toString()

      // Auto-join the coach to their group
      await db.collection("users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $set: { groupId } }
      )

      // Refresh session
      await createSession({
        ...session,
        groupId,
      })

      return NextResponse.json({
        success: true,
        group: { id: groupId, name: name.trim(), code },
      })
    }

    if (action === "join") {
      const { code } = body
      if (!code) {
        return NextResponse.json(
          { error: "Group code is required" },
          { status: 400 }
        )
      }

      const group = await db
        .collection("groups")
        .findOne({ code: code.toUpperCase() })

      if (!group) {
        return NextResponse.json(
          { error: "Invalid group code" },
          { status: 404 }
        )
      }

      const groupId = group._id.toString()

      await db.collection("users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $set: { groupId } }
      )

      // Refresh session
      await createSession({
        ...session,
        groupId,
      })

      return NextResponse.json({
        success: true,
        group: {
          id: groupId,
          name: group.name,
          code: group.code,
        },
      })
    }

    if (action === "leave") {
      await db.collection("users").updateOne(
        { _id: new ObjectId(session.userId) },
        { $set: { groupId: null } }
      )

      await createSession({
        ...session,
        groupId: undefined,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Groups error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// GET: fetch group members
export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get("groupId")

    if (!groupId) {
      return NextResponse.json({ members: [] })
    }

    const db = await getDb()
    const members = await db
      .collection("users")
      .find({ groupId })
      .project({ password: 0 })
      .toArray()

    return NextResponse.json({
      members: members.map((m) => ({
        id: m._id.toString(),
        displayName: m.displayName,
        email: m.email,
        role: m.role || "athlete",
      })),
    })
  } catch (error) {
    console.error("Get group members error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
