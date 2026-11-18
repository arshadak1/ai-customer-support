import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, logout, saveLogin } from "@/lib/api"
import { Waves } from "lucide-react"

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveLogin(username, password)
    try {
      await api("/login")
      onLogin()
    } catch {
      logout()
      setError("Wrong username or password")
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-white/70 bg-white/90 shadow-xl shadow-primary/5 backdrop-blur">
        <CardHeader className="px-8 pt-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Waves className="size-6" />
          </div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Harbor &amp; Pine
          </p>
          <CardTitle className="text-2xl tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to your customer support desk.
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="mt-1 h-11">
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
