import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { createSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password, displayName, role } = await req.json()

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Email, password, and display name are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    if (displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const existingUser = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const userRole = role === "coach" ? "coach" : "athlete"

    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: displayName.trim(),
      role: userRole,
      groupId: null,
      profileComplete: true,
      createdAt: new Date(),
    })

    await createSession({
      userId: result.insertedId.toString(),
      email: email.toLowerCase(),
      displayName: displayName.trim(),
      role: userRole,
      groupId: undefined,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: email.toLowerCase(),
        displayName: displayName.trim(),
        role: userRole,
        groupId: null,
        profileComplete: true,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
