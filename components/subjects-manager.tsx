"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, BookOpen, Edit } from "lucide-react"
import type { Subject } from "@/app/page"
import { useToast } from "@/hooks/use-toast"

type SubjectsManagerProps = {
  subjects: Subject[]
  onSubjectsChange: (subjects: Subject[]) => void
}

export function SubjectsManager({ subjects, onSubjectsChange }: SubjectsManagerProps) {
  const [newSubjectName, setNewSubjectName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Błąd",
        description: "Proszę podać nazwę przedmiotu",
        variant: "destructive",
      })
      return
    }

    // Check if subject already exists
    if (subjects.some((s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      toast({
        title: "Błąd",
        description: "Ten przedmiot już istnieje",
        variant: "destructive",
      })
      return
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
    }

    onSubjectsChange([...subjects, newSubject])
    setNewSubjectName("")

    toast({
      title: "Sukces!",
      description: "Przedmiot został dodany",
    })
  }

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id)
    setEditingName(subject.name)
  }

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa przedmiotu nie może być pusta",
        variant: "destructive",
      })
      return
    }

    // Check if another subject with this name exists
    if (subjects.some((s) => s.id !== id && s.name.toLowerCase() === editingName.trim().toLowerCase())) {
      toast({
        title: "Błąd",
        description: "Przedmiot o tej nazwie już istnieje",
        variant: "destructive",
      })
      return
    }

    onSubjectsChange(subjects.map((s) => (s.id === id ? { ...s, name: editingName.trim() } : s)))
    setEditingId(null)
    setEditingName("")

    toast({
      title: "Zaktualizowano!",
      description: "Nazwa przedmiotu została zmieniona",
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDeleteSubject = (id: string) => {
    onSubjectsChange(subjects.filter((s) => s.id !== id))
    toast({
      title: "Usunięto",
      description: "Przedmiot został usunięty",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <CardTitle>Dodaj nowy przedmiot</CardTitle>
          </div>
          <CardDescription>Stwórz przedmiot, który będzie dostępny przy dodawaniu ocen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Nazwa przedmiotu</Label>
              <Input
                id="subject-name"
                placeholder="np. Matematyka, Polski, Chemia"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
              />
            </div>
            <Button onClick={handleAddSubject} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj przedmiot
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twoje przedmioty</CardTitle>
          <CardDescription>Lista wszystkich przedmiotów</CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nie masz jeszcze żadnych przedmiotów</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {editingId === subject.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(subject.id)
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                        className="h-8"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSaveEdit(subject.id)}>
                        Zapisz
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Anuluj
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <p className="font-semibold">{subject.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(subject)}
                          className="hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
