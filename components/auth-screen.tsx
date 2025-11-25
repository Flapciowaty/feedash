"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, LogIn, UserPlus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

type AuthScreenProps = {
  onLogin: (email: string) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Wypełnij wszystkie pola")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}")

    if (isLogin) {
      // Login logic
      if (users[email] && users[email].password === password) {
        localStorage.setItem("currentUser", email)
        onLogin(email)
      } else {
        setError("Nieprawidłowy email lub hasło")
      }
    } else {
      // Registration logic
      if (password !== confirmPassword) {
        setError("Hasła nie są zgodne")
        return
      }

      if (password.length < 6) {
        setError("Hasło musi mieć co najmniej 6 znaków")
        return
      }

      if (users[email]) {
        setError("Użytkownik o tym emailu już istnieje")
        return
      }

      // Create new user
      users[email] = {
        email,
        password,
        weights: [
          { id: "1", name: "Kartkówka", value: 1 },
          { id: "2", name: "Sprawdzian", value: 3 },
          { id: "3", name: "Praca klasowa", value: 5 },
        ],
        subjects: [
          { id: "1", name: "Matematyka" },
          { id: "2", name: "Polski" },
          { id: "3", name: "Angielski" },
          { id: "4", name: "Historia" },
          { id: "5", name: "Biologia" },
        ],
        grades: [],
      }
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", email)
      onLogin(email)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Dziennik Ocen</h1>
          <p className="text-muted-foreground">by Feero</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Zaloguj się" : "Utwórz konto"}</CardTitle>
            <CardDescription>
              {isLogin ? "Wprowadź swoje dane, aby się zalogować" : "Wypełnij formularz, aby utworzyć nowe konto"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full">
                {isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Zaloguj się
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Zarejestruj się
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
