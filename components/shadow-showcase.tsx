"use client"

import { useState } from "react"
import { Moon, Sun, Dumbbell, Flame, Zap, TrendingUp, Activity, Timer, ChevronRight, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const elevations = [
  {
    label: "Flat",
    className: "",
    description: "No elevation. Used for background-level elements.",
  },
  {
    label: "sm",
    className: "shadow-raised-sm",
    description: "Chips, badges, inline tags. Barely lifts off the surface.",
  },
  {
    label: "Default",
    className: "shadow-raised",
    description: "Standard card. The most common elevation in the system.",
  },
  {
    label: "lg",
    className: "shadow-raised-lg",
    description: "Dropdown menus, popovers, date pickers.",
  },
  {
    label: "xl",
    className: "shadow-raised-xl",
    description: "Modals, hero panels, featured content.",
  },
  {
    label: "Pressed",
    className: "shadow-pressed",
    description: "Active/pressed button state. Pushes into the surface.",
  },
  {
    label: "Inset",
    className: "shadow-inset",
    description: "Input fields, recessed wells, inner containers.",
  },
]

const stats = [
  { label: "Sessions", value: "142", icon: Activity, delta: "+12 this month" },
  { label: "Avg. Duration", value: "58m", icon: Timer, delta: "+4m vs last month" },
  { label: "Streak", value: "14d", icon: Flame, delta: "Personal best" },
  { label: "Load Index", value: "87%", icon: TrendingUp, delta: "Optimal range" },
]

const workouts = [
  { emoji: "⚔️", label: "Footwork Drills", tag: "Technique", duration: "45m", intensity: "Medium" },
  { emoji: "💧", label: "Endurance Run", tag: "Cardio", duration: "60m", intensity: "High" },
  { emoji: "🔥", label: "Strength Circuit", tag: "Strength", duration: "50m", intensity: "High" },
  { emoji: "⭐", label: "Bout Practice", tag: "Sparring", duration: "90m", intensity: "Very High" },
]

const tags = ["Technique", "Cardio", "Strength", "Sparring", "Recovery", "Drills"]

export function ShadowShowcase() {
  const [dark, setDark] = useState(false)
  const [activeTag, setActiveTag] = useState("Technique")
  const [pressedBtn, setPressedBtn] = useState(false)

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl shadow-raised-sm">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-raised-sm">
                <Dumbbell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight">Pretvia</span>
              <Badge className="shadow-raised-sm text-xs">Shadow System</Badge>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-raised-sm transition-all hover:text-foreground active:shadow-pressed"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* Section 1 — Elevation Scale */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">01 — Elevation Scale</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Seven elevation levels, each combining an ambient shadow, a directional key-light shadow, and a 1px inset top-highlight. Light mode uses cool-gray tones; dark mode deepens the shadows significantly.
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-7">
              {elevations.map((e) => (
                <div key={e.label} className="flex flex-col gap-3">
                  <div
                    className={`aspect-square w-full rounded-xl border border-border bg-card ${e.className} transition-all`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{e.label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 — Stat Cards */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">02 — Stat Cards (shadow-raised)</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Default card elevation. The inset highlight on the top edge reads as a light source directly overhead, giving each card a physical lift.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-5 shadow-raised transition-shadow hover:shadow-raised-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shadow-raised-sm">
                      <s.icon className="h-4 w-4 text-primary" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-[11px] text-primary">{s.delta}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — Log Cards */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">03 — Training Log (shadow-raised-lg on hover)</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              List items start at <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised</code> and transition to <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised-lg</code> on hover, signaling interactivity through depth change.
            </p>
            <div className="flex flex-col gap-3">
              {workouts.map((w) => (
                <div
                  key={w.label}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-raised transition-all hover:shadow-raised-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary shadow-raised-sm text-xl">
                    {w.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{w.label}</p>
                    <p className="text-xs text-muted-foreground">{w.duration} &middot; {w.intensity}</p>
                  </div>
                  <Badge variant="secondary" className="shadow-raised-sm text-xs shrink-0">{w.tag}</Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 — Filter Tags + Buttons */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">04 — Tags & Buttons (raised-sm / pressed)</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Inactive tags use <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised-sm</code>. The active tag uses <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-pressed</code> to look selected. Buttons animate between raised and pressed states.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTag === t
                      ? "border-primary bg-primary text-primary-foreground shadow-pressed"
                      : "border-border bg-card text-muted-foreground shadow-raised-sm hover:text-foreground hover:shadow-raised"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onMouseDown={() => setPressedBtn(true)}
                onMouseUp={() => setPressedBtn(false)}
                onMouseLeave={() => setPressedBtn(false)}
                className={`flex items-center gap-2 rounded-lg border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all select-none ${
                  pressedBtn ? "shadow-pressed scale-[0.98]" : "shadow-raised hover:shadow-raised-lg"
                }`}
              >
                <Zap className="h-4 w-4" />
                Log Session
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-raised transition-all hover:shadow-raised-lg active:shadow-pressed active:scale-[0.98] select-none">
                <Star className="h-4 w-4 text-muted-foreground" />
                Save Template
              </button>
            </div>
          </section>

          {/* Section 5 — Inset input well */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">05 — Inputs & Wells (shadow-inset)</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Inset shadows reverse the illusion — the element is pushed <em>into</em> the surface. Ideal for text inputs, textareas, and recessed information panels.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-raised">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Session Notes
                </label>
                <textarea
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-inset outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                  rows={4}
                  placeholder="How did it feel? Any observations..."
                />
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-raised">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Search Logs
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-inset outline-none focus:ring-2 focus:ring-ring/30 transition-shadow mb-4"
                  placeholder="Search by tag, date, athlete..."
                />
                <div className="rounded-lg border border-border bg-background px-4 py-3 shadow-inset">
                  <p className="text-xs text-muted-foreground">Recessed information panel — same <code className="text-primary">shadow-inset</code> applied to a container.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 — Layered depth composition */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">06 — Layered Depth Composition</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Elements at different elevations compose a spatial hierarchy. The outer panel uses <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised-xl</code>, inner cards use <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised</code>, and chips use <code className="rounded bg-muted px-1 py-0.5 text-xs">shadow-raised-sm</code>.
            </p>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-raised-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Weekly Overview</h3>
                  <p className="text-xs text-muted-foreground">March 2026</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 shadow-raised-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-foreground">On Track</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { day: "Mon", done: true, emoji: "⚔️", label: "Footwork" },
                  { day: "Wed", done: true, emoji: "💧", label: "Endurance" },
                  { day: "Fri", done: false, emoji: "🔥", label: "Strength" },
                ].map((d) => (
                  <div key={d.day} className="rounded-xl border border-border bg-background p-4 shadow-raised">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{d.day}</span>
                      {d.done && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-raised-sm">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{d.emoji}</span>
                      <span className="text-sm font-medium text-foreground">{d.label}</span>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      {["shadow-raised-sm", d.done ? "bg-primary/20" : "bg-muted"].map((cls, i) => (
                        <span key={i} className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border ${cls}`}>
                          {i === 0 ? "Chip" : d.done ? "Done" : "Pending"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
