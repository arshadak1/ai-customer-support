import { useEffect, useState } from "react"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import { formatDate, type SupportEvent } from "@/lib/types"
import { Inbox, RefreshCw } from "lucide-react"

export function EventsPage() {
  const [events, setEvents] = useState<SupportEvent[]>([])
  const [checking, setChecking] = useState(false)

  const load = () => api<SupportEvent[]>("/events").then(setEvents)

  useEffect(() => {
    load()
  }, [])

  async function checkInbox() {
    setChecking(true)
    try {
      await api("/poll", { method: "POST" })
      await load()
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Inbox activity
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A live log of messages as they move through your support workflow.
          </p>
        </div>
        <Button onClick={checkInbox} disabled={checking} className="shadow-sm">
          <RefreshCw className={`size-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Checking inbox…" : "Check inbox now"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="pr-5">Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="rounded-full bg-muted p-3">
                      <Inbox className="size-5" />
                    </div>
                    <span className="font-medium text-foreground">
                      No activity yet
                    </span>
                    <span>Your inbox events will appear here.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="pl-5 font-mono text-xs text-muted-foreground">
                    #{event.id}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={event.status} />
                  </TableCell>
                  <TableCell>{event.attempts}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {event.error || "—"}
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground">
                    {formatDate(event.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
