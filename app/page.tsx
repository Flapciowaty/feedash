"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradesOverview } from "@/components/grades-overview"
import { WeightsManager } from "@/components/weights-manager"
import { AddGrade } from "@/components/add-grade"
import { SubjectsManager } from "@/components/subjects-manager"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthScreen } from "@/components/auth-screen"
import { GraduationCap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Weight = {
  id: string
  name: string
  value: number
}

export type Grade = {
  id: string
  subject: string
  value: number
  weightId: string
  date: string
  isPredicted: boolean
}

export type Subject = {
  id: string
  name: string
}

export type User = {
  email: string
  password: string
  weights: Weight[]
  grades: Grade[]
  subjects: Subject[]
}

export default function GradeJournalPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [weights, setWeights] = useState<Weight[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(savedUser)
    }
  }, [])

  useEffect(() => {
    if (!currentUser) return

    const users = JSON.parse(localStorage.getItem("users") || "{}")
    const userData = users[currentUser]

    if (userData) {
      setWeights(userData.weights || [])
      setGrades(userData.grades || [])
      setSubjects(userData.subjects || [])
    } else {
      // Default data for new user
      const defaultWeights = [
        { id: "1", name: "Kartkówka", value: 1 },
        { id: "2", name: "Sprawdzian", value: 3 },
        { id: "3", name: "Praca klasowa", value: 5 },
      ]
      const defaultSubjects = [
        { id: "1", name: "Matematyka" },
        { id: "2", name: "Polski" },
        { id: "3", name: "Angielski" },
        { id: "4", name: "Historia" },
        { id: "5", name: "Biologia" },
      ]
      setWeights(defaultWeights)
      setSubjects(defaultSubjects)
      setGrades([])
    }
  }, [currentUser])

  const saveUserData = (newWeights: Weight[], newGrades: Grade[], newSubjects: Subject[]) => {
    if (!currentUser) return

    const users = JSON.parse(localStorage.getItem("users") || "{}")
    users[currentUser] = {
      email: currentUser,
      password: users[currentUser]?.password || "",
      weights: newWeights,
      grades: newGrades,
      subjects: newSubjects,
    }
    localStorage.setItem("users", JSON.stringify(users))
  }

  const handleWeightsChange = (newWeights: Weight[]) => {
    setWeights(newWeights)
    saveUserData(newWeights, grades, subjects)
  }

  const handleGradesChange = (newGrades: Grade[]) => {
    setGrades(newGrades)
    saveUserData(weights, newGrades, subjects)
  }

  const handleSubjectsChange = (newSubjects: Subject[]) => {
    setSubjects(newSubjects)
    saveUserData(weights, grades, newSubjects)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setWeights([])
    setGrades([])
    setSubjects([])
  }

  if (!currentUser) {
    return <AuthScreen onLogin={setCurrentUser} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-balance">Dziennik Ocen</h1>
                <p className="text-sm text-muted-foreground mt-1">Zalogowany jako: {currentUser}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">Zarządzaj swoimi ocenami i obliczaj średnią ważoną</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="add">Dodaj ocenę</TabsTrigger>
            <TabsTrigger value="subjects">Przedmioty</TabsTrigger>
            <TabsTrigger value="weights">Wagi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <GradesOverview
              grades={grades}
              weights={weights}
              subjects={subjects}
              onDeleteGrade={(id) => handleGradesChange(grades.filter((g) => g.id !== id))}
            />
          </TabsContent>

          <TabsContent value="add">
            <AddGrade
              weights={weights}
              subjects={subjects}
              onAddGrade={(grade) => handleGradesChange([...grades, grade])}
            />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectsManager subjects={subjects} onSubjectsChange={handleSubjectsChange} />
          </TabsContent>

          <TabsContent value="weights">
            <WeightsManager weights={weights} onWeightsChange={handleWeightsChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
