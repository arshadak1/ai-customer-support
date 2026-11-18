import { useEffect, useState } from "react"
import { StatusBadge } from "@/components/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import { formatDate, type Message, type Ticket } from "@/lib/types"
import { MessagesSquare } from "lucide-react"

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    api<Ticket[]>("/tickets").then(setTickets)
  }, [])

  async function open(ticket: Ticket) {
    setSelected(ticket)
    setMessages(await api<Message[]>(`/tickets/${ticket.id}/messages`))
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          Customer conversations
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a conversation to see the full message history and suggested
          next step.
        </p>
      </div>
      <div className="grid min-w-0 items-start gap-5 2xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
        <div className="min-w-0 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[34%] pl-5">Subject</TableHead>
                <TableHead className="w-[31%]">Customer</TableHead>
                <TableHead className="w-[17%]">Category</TableHead>
                <TableHead className="w-[18%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center text-muted-foreground"
                  >
                    No conversations yet.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => open(ticket)}
                    data-state={
                      ticket.id === selected?.id ? "selected" : undefined
                    }
                    className="cursor-pointer"
                  >
                    <TableCell
                      className="max-w-0 truncate pl-5 font-medium"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </TableCell>
                    <TableCell
                      className="max-w-0 truncate text-muted-foreground"
                      title={ticket.customer_email}
                    >
                      {ticket.customer_email}
                    </TableCell>
                    <TableCell
                      className="max-w-0 truncate text-muted-foreground capitalize"
                      title={ticket.category ?? undefined}
                    >
                      {ticket.category}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selected ? (
          <div className="flex min-h-72 min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm">
            <div className="min-w-0 border-b pb-4">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Conversation
              </p>
              <h2 className="mt-1 font-semibold tracking-tight break-words">
                {selected.subject}
              </h2>
              <p className="mt-1 text-xs break-all text-muted-foreground">
                {selected.customer_email}
              </p>
            </div>
            {selected.proposed_action && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm leading-5 [overflow-wrap:anywhere] break-words text-amber-950">
                <span className="font-semibold">Suggested next step</span>
                <br />
                {selected.proposed_action}
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-full min-w-0 [overflow-wrap:anywhere] ${
                  message.direction === "out"
                    ? "ml-8 rounded-2xl rounded-br-sm bg-primary p-3.5 text-primary-foreground shadow-sm"
                    : "mr-8 rounded-2xl rounded-bl-sm border bg-background p-3.5"
                }`}
              >
                <p className="mb-1 text-xs break-all opacity-70">
                  {message.from_address}, {formatDate(message.created_at)}
                </p>
                <p className="text-sm [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                  {message.body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-white/60 p-8 text-center">
            <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
              <MessagesSquare className="size-5" />
            </div>
            <p className="font-medium">Your conversation, at a glance</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Select a ticket from the list to read the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
