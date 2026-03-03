import { NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import { apiError, apiSuccess } from "@/lib/api-utils"
import { sendFeedbackEmail } from "@/lib/resend"

const MAX_MESSAGE_LENGTH = 2000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const page = typeof body.page === "string" ? body.page.trim().slice(0, 500) : undefined

    if (!message) {
      return apiError("Feedback message is required", 400)
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return apiError(`Message must be at most ${MAX_MESSAGE_LENGTH} characters`, 400)
    }

    const session = await getSession()
    const metadata: { email?: string; displayName?: string; page?: string } = { page: page || undefined }
    if (session?.email) metadata.email = session.email
    if (session?.displayName) metadata.displayName = session.displayName

    const result = await sendFeedbackEmail(message, metadata)
    if (!result.ok) {
      return apiError(result.error ?? "Failed to send feedback", 500)
    }

    return apiSuccess({ message: "Feedback sent" })
  } catch (err) {
    console.error("POST /api/feedback:", err)
    return apiError("Internal server error", 500)
  }
}
