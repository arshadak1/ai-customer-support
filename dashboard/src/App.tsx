import { useState } from "react"
import { ArrowUpRight, LifeBuoy, LogOut, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isLoggedIn, logout } from "@/lib/api"
import { EventsPage } from "@/pages/events"
import { KnowledgeBasePage } from "@/pages/knowledge-base"
import { LoginPage } from "@/pages/login"
import { TicketsPage } from "@/pages/tickets"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  function logOut() {
    logout()
    setLoggedIn(false)
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Waves className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Harbor &amp; Pine
              </p>
              <h1 className="text-base font-semibold tracking-tight">
                Support desk
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Inbox
              connected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logOut}
              className="text-muted-foreground"
            >
              <LogOut className="size-4" />{" "}
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Customer care
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A calmer way to help.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Keep an eye on incoming support, follow conversations, and keep
              your answers up to date.
            </p>
          </div>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            href="mailto:support@harborandpine.com"
          >
            <LifeBuoy className="size-4" /> Support guide{" "}
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <Tabs defaultValue="events" className="gap-6">
          <TabsList className="h-auto w-full max-w-full justify-start gap-1 overflow-x-auto rounded-xl border border-border/70 bg-white p-1.5 shadow-sm sm:w-fit">
            <TabsTrigger
              value="events"
              className="h-10 flex-none rounded-lg px-4"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="h-10 flex-none rounded-lg px-4"
            >
              Conversations
            </TabsTrigger>
            <TabsTrigger
              value="knowledge-base"
              className="h-10 flex-none rounded-lg px-4"
            >
              Knowledge base
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <EventsPage />
          </TabsContent>
          <TabsContent value="tickets">
            <TicketsPage />
          </TabsContent>
          <TabsContent value="knowledge-base">
            <KnowledgeBasePage />
          </TabsContent>
        </Tabs>
        <footer className="mt-12 flex items-center justify-between border-t border-border/70 pt-5 text-xs text-muted-foreground">
          <span>Harbor &amp; Pine · Customer care</span>
          <span>Made for thoughtful service</span>
        </footer>
      </main>
    </div>
  )
}
