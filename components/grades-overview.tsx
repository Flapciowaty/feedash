"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, Trash2, TrendingUp, BookOpen, Eye, CheckCircle2 } from "lucide-react"
import type { Grade, Weight, Subject } from "@/app/page"

type GradesOverviewProps = {
  grades: Grade[]
  weights: Weight[]
  subjects: Subject[]
  onDeleteGrade: (id: string) => void
}

export function GradesOverview({ grades, weights, subjects, onDeleteGrade }: GradesOverviewProps) {
  const calculateWeightedAverage = () => {
    if (grades.length === 0) return 0

    let totalWeightedScore = 0
    let totalWeight = 0

    grades.forEach((grade) => {
      const weight = weights.find((w) => w.id === grade.weightId)
      if (weight) {
        totalWeightedScore += grade.value * weight.value
        totalWeight += weight.value
      }
    })

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0
  }

  const getWeightName = (weightId: string) => {
    const weight = weights.find((w) => w.id === weightId)
    return weight ? weight.name : "Nieznana"
  }

  const getWeightValue = (weightId: string) => {
    const weight = weights.find((w) => w.id === weightId)
    return weight ? weight.value : 0
  }

  const getGradeColor = (value: number) => {
    if (value >= 5) return "bg-chart-4 text-foreground"
    if (value >= 4) return "bg-chart-1 text-foreground"
    if (value >= 3) return "bg-chart-5 text-foreground"
    if (value >= 2) return "bg-chart-2 text-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  const gradesBySubject = grades.reduce(
    (acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = []
      }
      acc[grade.subject].push(grade)
      return acc
    },
    {} as Record<string, Grade[]>,
  )

  const calculateSubjectAverage = (subjectGrades: Grade[]) => {
    if (subjectGrades.length === 0) return 0

    let totalWeightedScore = 0
    let totalWeight = 0

    subjectGrades.forEach((grade) => {
      const weight = weights.find((w) => w.id === grade.weightId)
      if (weight) {
        totalWeightedScore += grade.value * weight.value
        totalWeight += weight.value
      }
    })

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0
  }

  const weightedAverage = calculateWeightedAverage()

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>Średnia ważona</CardTitle>
          </div>
          <CardDescription>
            Obliczona na podstawie {grades.length} {grades.length === 1 ? "oceny" : "ocen"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-bold text-primary">{weightedAverage}</span>
            <span className="text-2xl text-muted-foreground">/6.0</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wszystkie oceny</CardTitle>
          <CardDescription>Lista wszystkich twoich ocen pogrupowanych według przedmiotów</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="text-center py-12">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nie masz jeszcze żadnych ocen</p>
              <p className="text-sm text-muted-foreground mt-2">Dodaj pierwszą ocenę w zakładce "Dodaj ocenę"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(gradesBySubject).map(([subject, subjectGrades]) => (
                <div key={subject} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">{subject}</h3>
                      <Badge variant="outline" className="ml-2">
                        {subjectGrades.length} {subjectGrades.length === 1 ? "ocena" : "ocen"}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground">Średnia:</span>
                      <span className="text-2xl font-bold text-primary">{calculateSubjectAverage(subjectGrades)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pl-4">
                    {subjectGrades.map((grade) => (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`px-4 py-2 rounded-lg font-bold text-2xl ${getGradeColor(grade.value)} ${grade.isPredicted ? "opacity-60" : ""}`}
                          >
                            {grade.value}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary">
                                {getWeightName(grade.weightId)} (waga: {getWeightValue(grade.weightId)})
                              </Badge>
                              {grade.isPredicted ? (
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-blue-500 text-blue-600 dark:text-blue-400"
                                >
                                  <Eye className="w-3 h-3" />
                                  Symulacja
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-green-500 text-green-600 dark:text-green-400"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">{grade.date}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteGrade(grade.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
