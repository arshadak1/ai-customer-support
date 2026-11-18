import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import type { Entry } from "@/lib/types"
import { BookOpen, Check, FileText } from "lucide-react"

export function KnowledgeBasePage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api<Entry[]>("/knowledge-base").then(setEntries)
  }, [])

  const sections = [...new Set(entries.map((entry) => entry.section))]

  function select(entry: Entry) {
    setSelectedId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setSaved(false)
  }

  async function save() {
    const updated = await api<Entry>(`/knowledge-base/${selectedId}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    })
    setEntries(
      entries.map((entry) => (entry.id === updated.id ? updated : entry))
    )
    setSaved(true)
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Knowledge base</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep the team’s answers consistent, useful, and up to date.
        </p>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[280px_1fr]">
        <nav className="flex flex-col gap-5 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-3 text-sm font-semibold">
            <BookOpen className="size-4 text-primary" /> Help articles
          </div>
          {sections.map((section) => (
            <div key={section}>
              <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                {section}
              </p>
              {entries
                .filter((entry) => entry.section === section)
                .map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => select(entry)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      entry.id === selectedId
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {entry.title}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        {selectedId === null ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed bg-white/60 p-8 text-center">
            <FileText className="mb-3 size-6 text-primary" />
            <p className="font-medium">Choose an article to edit</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your saved guidance will be ready for the whole team.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="border-b pb-3">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Article editor
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the title and content below.
              </p>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-96 resize-y leading-7"
            />
            <div className="flex items-center gap-3">
              <Button onClick={save}>Save changes</Button>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <Check className="size-4" /> Saved
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
