"use client"

import React from "react"
import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Users, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { EmojiPicker } from "./emoji-picker"
import { TagInput } from "./tag-input"
import { toast } from "sonner"
import type { LogEntry } from "./log-card"

interface LogFormProps {
  onLogCreated: () => void
  onClose?: () => void
  editLog?: LogEntry | null
}

function getLocalTimestamp() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

function toLocalTimestamp(isoString: string) {
  const d = new Date(isoString)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export function LogForm({ onLogCreated, onClose, editLog }: LogFormProps) {
  const isEditing = Boolean(editLog)

  const [emoji, setEmoji] = useState(editLog?.emoji || "")
  const [timestamp, setTimestamp] = useState(
    editLog ? toLocalTimestamp(editLog.timestamp) : getLocalTimestamp()
  )
  const [isGroup, setIsGroup] = useState(editLog?.isGroup || false)
  const [notes, setNotes] = useState(editLog?.notes || "")
  const [tags, setTags] = useState<string[]>(editLog?.tags || [])
  const [loading, setLoading] = useState(false)

  // Sync fields when editLog changes
  useEffect(() => {
    if (editLog) {
      setEmoji(editLog.emoji)
      setTimestamp(toLocalTimestamp(editLog.timestamp))
      setIsGroup(editLog.isGroup)
      setNotes(editLog.notes)
      setTags(editLog.tags)
    } else {
      setEmoji("")
      setTimestamp(getLocalTimestamp())
      setIsGroup(false)
      setNotes("")
      setTags([])
    }
  }, [editLog])

  const resetForm = useCallback(() => {
    setEmoji("")
    setNotes("")
    setTags([])
    setIsGroup(false)
    setTimestamp(getLocalTimestamp())
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!emoji) {
        toast.error("Please select an emoji for your log")
        return
      }

      setLoading(true)
      try {
        if (isEditing && editLog) {
          // PUT to update
          const res = await fetch("/api/logs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: editLog.id,
              emoji,
              timestamp: new Date(timestamp).toISOString(),
              isGroup,
              notes,
              tags,
            }),
          })
          if (!res.ok) {
            const data = await res.json()
            toast.error(data.error || "Failed to update log")
            return
          }
          toast.success("Log updated!")
        } else {
          // POST to create
          const res = await fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emoji,
              timestamp: new Date(timestamp).toISOString(),
              isGroup,
              notes,
              tags,
            }),
          })
          if (!res.ok) {
            const data = await res.json()
            toast.error(data.error || "Failed to create log")
            return
          }
          toast.success("Log entry created!")
          resetForm()
        }
        onLogCreated()
      } catch {
        toast.error("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [emoji, timestamp, isGroup, notes, tags, onLogCreated, isEditing, editLog, resetForm]
  )

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {isEditing ? "Edit Log" : "New Log Entry"}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Emoji Picker */}
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Activity</Label>
        <EmojiPicker value={emoji} onChange={setEmoji} />
      </div>

      {/* DateTime */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="timestamp" className="text-foreground">
          Date & Time
        </Label>
        <input
          id="timestamp"
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [color-scheme:dark]"
        />
      </div>

      {/* Group/Private Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3">
        <div className="flex items-center gap-2">
          {isGroup ? (
            <Users className="h-4 w-4 text-primary" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">
            {isGroup ? "Group" : "Private"}
          </span>
        </div>
        <Switch
          checked={isGroup}
          onCheckedChange={setIsGroup}
          aria-label="Toggle group or private"
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes" className="text-foreground">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your session?"
          rows={3}
          className="resize-none border-border bg-secondary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Tags</Label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !emoji}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEditing ? (
          "Update Log"
        ) : (
          "Save Log Entry"
        )}
      </Button>
    </motion.form>
  )
}
