import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tags = searchParams.getAll("tag")
    const filterUserId = searchParams.get("userId") // Filter by specific athlete
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const db = await getDb()

    // Fetch current user to get groupId
    const currentUser = await db.collection("users").findOne({
      _id: new ObjectId(session.userId),
    })
    const userGroupId = currentUser?.groupId || null

    // Build filter: own logs + group logs (non-private) from same group
    let filter: Record<string, unknown>

    if (userGroupId) {
      // Get all members of the same group (support both old groupId and new groupIds)
      const groupMembers = await db
        .collection("users")
        .find({ $or: [{ groupIds: userGroupId }, { groupId: userGroupId }] })
        .project({ _id: 1 })
        .toArray()
      const memberIds = groupMembers.map((m) => m._id.toString())

      if (filterUserId && currentUser?.role === "coach" && memberIds.includes(filterUserId)) {
        // Coach filtering by specific athlete
        filter = {
          userId: filterUserId,
          isGroup: true,
        }
      } else {
        filter = {
          $or: [
            { userId: session.userId }, // All own logs
            { userId: { $in: memberIds }, isGroup: true }, // Group members' non-private logs
          ],
        }
      }
    } else {
      filter = { userId: session.userId }
    }

    if (tags.length > 0) {
      filter.tags = { $all: tags }
    }

    // Date filtering
    if (dateFrom || dateTo) {
      const timestampFilter: Record<string, Date> = {}
      if (dateFrom) timestampFilter.$gte = new Date(dateFrom)
      if (dateTo) timestampFilter.$lte = new Date(dateTo)
      filter.timestamp = timestampFilter
    }

    const logs = await db
      .collection("logs")
      .find(filter)
      .sort({ timestamp: -1 })
      .toArray()

    // Fetch display names for all user IDs in the results
    const userIds = [...new Set(logs.map((l) => l.userId))]
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .project({ displayName: 0, password: 0 })
      .toArray()

    // Build a map -- we only need displayName
    const usersFullData = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .project({ password: 0 })
      .toArray()
    const userMap = new Map(
      usersFullData.map((u) => [u._id.toString(), u.displayName || "Unknown"])
    )

    // Suppress unused variable
    void users

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log._id.toString(),
        emoji: log.emoji,
        timestamp: log.timestamp,
        isGroup: log.isGroup,
        notes: log.notes,
        tags: log.tags || [],
        userId: log.userId,
        userName: userMap.get(log.userId) || "Unknown",
        isOwn: log.userId === session.userId,
        createdAt: log.createdAt,
      })),
    })
  } catch (error) {
    console.error("Get logs error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emoji, timestamp, isGroup, notes, tags } = await req.json()

    if (!emoji) {
      return NextResponse.json(
        { error: "An emoji is required" },
        { status: 400 }
      )
    }

    const db = await getDb()

    const logEntry = {
      userId: session.userId,
      emoji,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      isGroup: Boolean(isGroup),
      notes: notes || "",
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date(),
    }

    const result = await db.collection("logs").insertOne(logEntry)

    // Save any new tags for the user
    if (logEntry.tags.length > 0) {
      for (const tag of logEntry.tags) {
        await db.collection("tags").updateOne(
          { userId: session.userId, name: tag },
          {
            $set: { name: tag, userId: session.userId },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true }
        )
      }
    }

    return NextResponse.json({
      success: true,
      log: {
        id: result.insertedId.toString(),
        ...logEntry,
        userName: session.displayName || "Unknown",
        isOwn: true,
      },
    })
  } catch (error) {
    console.error("Create log error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, emoji, timestamp, isGroup, notes, tags } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 })
    }

    const db = await getDb()

    // Only allow editing own logs
    const existing = await db.collection("logs").findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Log not found or not authorized" },
        { status: 404 }
      )
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (emoji !== undefined) update.emoji = emoji
    if (timestamp !== undefined) update.timestamp = new Date(timestamp)
    if (isGroup !== undefined) update.isGroup = Boolean(isGroup)
    if (notes !== undefined) update.notes = notes
    if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : []

    await db.collection("logs").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )

    // Upsert any new tags
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        await db.collection("tags").updateOne(
          { userId: session.userId, name: tag },
          {
            $set: { name: tag, userId: session.userId },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update log error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const logId = searchParams.get("id")

    if (!logId) {
      return NextResponse.json(
        { error: "Log ID is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    await db.collection("logs").deleteOne({
      _id: new ObjectId(logId),
      userId: session.userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete log error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
