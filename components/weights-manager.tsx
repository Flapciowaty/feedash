"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, WeightIcon, Pencil, Check, X } from "lucide-react"
import type { Weight } from "@/app/page"

type WeightsManagerProps = {
  weights: Weight[]
  onWeightsChange: (weights: Weight[]) => void
}

export function WeightsManager({ weights, onWeightsChange }: WeightsManagerProps) {
  const [newWeightName, setNewWeightName] = useState("")
  const [newWeightValue, setNewWeightValue] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editValue, setEditValue] = useState("")

  const handleAddWeight = () => {
    if (!newWeightName.trim() || !newWeightValue) return

    const value = Number.parseFloat(newWeightValue)
    if (isNaN(value) || value <= 0) return

    const newWeight: Weight = {
      id: Date.now().toString(),
      name: newWeightName.trim(),
      value: value,
    }

    onWeightsChange([...weights, newWeight])
    setNewWeightName("")
    setNewWeightValue("")
  }

  const handleDeleteWeight = (id: string) => {
    onWeightsChange(weights.filter((w) => w.id !== id))
  }

  const handleStartEdit = (weight: Weight) => {
    setEditingId(weight.id)
    setEditName(weight.name)
    setEditValue(weight.value.toString())
  }

  const handleSaveEdit = () => {
    if (!editName.trim() || !editValue) return

    const value = Number.parseFloat(editValue)
    if (isNaN(value) || value <= 0) return

    const updatedWeights = weights.map((w) => (w.id === editingId ? { ...w, name: editName.trim(), value: value } : w))
    onWeightsChange(updatedWeights)
    setEditingId(null)
    setEditName("")
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditValue("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <CardTitle>Dodaj nową wagę</CardTitle>
          </div>
          <CardDescription>Stwórz wagę dla różnych typów sprawdzianów</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight-name">Nazwa wagi</Label>
                <Input
                  id="weight-name"
                  placeholder="np. Kartkówka, Sprawdzian"
                  value={newWeightName}
                  onChange={(e) => setNewWeightName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight-value">Wartość wagi</Label>
                <Input
                  id="weight-value"
                  type="number"
                  placeholder="np. 1, 3, 5"
                  value={newWeightValue}
                  onChange={(e) => setNewWeightValue(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>
            <Button onClick={handleAddWeight} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj wagę
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dostępne wagi</CardTitle>
          <CardDescription>Lista wszystkich wag używanych do ocen</CardDescription>
        </CardHeader>
        <CardContent>
          {weights.length === 0 ? (
            <div className="text-center py-12">
              <WeightIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nie masz jeszcze żadnych wag</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weights.map((weight) => (
                <div
                  key={weight.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {editingId === weight.id ? (
                    <>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <WeightIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nazwa wagi"
                          />
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Wartość"
                            min="0.1"
                            step="0.1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={handleSaveEdit} className="text-green-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <WeightIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{weight.name}</p>
                          <p className="text-sm text-muted-foreground">Waga: {weight.value}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(weight)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWeight(weight.id)}
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
