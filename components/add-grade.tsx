"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, BookOpen } from "lucide-react"
import type { Weight, Grade, Subject } from "@/app/page"
import { useToast } from "@/hooks/use-toast"

type AddGradeProps = {
  weights: Weight[]
  subjects: Subject[]
  onAddGrade: (grade: Grade) => void
}

export function AddGrade({ weights, subjects, onAddGrade }: AddGradeProps) {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [gradeValue, setGradeValue] = useState("")
  const [selectedWeightId, setSelectedWeightId] = useState("")
  const [isPredicted, setIsPredicted] = useState(false)
  const { toast } = useToast()

  const handleAddGrade = () => {
    if (!selectedSubject) {
      toast({
        title: "Błąd",
        description: "Proszę wybrać przedmiot",
        variant: "destructive",
      })
      return
    }

    const value = Number.parseFloat(gradeValue)
    if (isNaN(value) || value < 1 || value > 6) {
      toast({
        title: "Błąd",
        description: "Ocena musi być liczbą od 1 do 6",
        variant: "destructive",
      })
      return
    }

    if (!selectedWeightId) {
      toast({
        title: "Błąd",
        description: "Proszę wybrać wagę",
        variant: "destructive",
      })
      return
    }

    const newGrade: Grade = {
      id: Date.now().toString(),
      subject: selectedSubject,
      value: value,
      weightId: selectedWeightId,
      date: new Date().toLocaleDateString("pl-PL"),
      isPredicted: isPredicted,
    }

    onAddGrade(newGrade)

    // Reset form
    setSelectedSubject("")
    setGradeValue("")
    setSelectedWeightId("")
    setIsPredicted(false)

    toast({
      title: "Sukces!",
      description: isPredicted ? "Ocena symulacyjna została dodana" : "Ocena została dodana",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <CardTitle>Dodaj nową ocenę</CardTitle>
        </div>
        <CardDescription>Wprowadź szczegóły nowej oceny</CardDescription>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 || weights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              {subjects.length === 0 && weights.length === 0
                ? "Nie masz jeszcze żadnych przedmiotów ani wag"
                : subjects.length === 0
                  ? "Nie masz jeszcze żadnych przedmiotów"
                  : "Nie masz jeszcze żadnych wag"}
            </p>
            <p className="text-sm text-muted-foreground">
              {subjects.length === 0 && weights.length === 0
                ? 'Przejdź do zakładki "Przedmioty" i "Wagi" aby je dodać'
                : subjects.length === 0
                  ? 'Przejdź do zakładki "Przedmioty" i dodaj pierwszy przedmiot'
                  : 'Przejdź do zakładki "Wagi" i dodaj pierwszą wagę'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Przedmiot</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Wybierz przedmiot" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="grade">Ocena (1-6)</Label>
                  <Input
                    id="grade"
                    type="number"
                    placeholder="np. 5"
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    min="1"
                    max="6"
                    step="0.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Waga</Label>
                  <Select value={selectedWeightId} onValueChange={setSelectedWeightId}>
                    <SelectTrigger id="weight">
                      <SelectValue placeholder="Wybierz wagę" />
                    </SelectTrigger>
                    <SelectContent>
                      {weights.map((weight) => (
                        <SelectItem key={weight.id} value={weight.id}>
                          {weight.name} (waga: {weight.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="predicted" className="text-base">
                    Tryb symulacji
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isPredicted
                      ? "Ocena symulacyjna - służy do przewidywania średniej"
                      : "Ocena symulacyjna - służy do przewidywania średniej"}
                  </p>
                </div>
                <Switch id="predicted" checked={isPredicted} onCheckedChange={setIsPredicted} />
              </div>
            </div>

            <Button onClick={handleAddGrade} className="w-full" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj ocenę
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
