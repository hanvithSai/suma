"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"

interface MCQ {
  id: string
  question: string
  options: string[]
  correctOption: number
  timer: number
}

interface MCQCreatorProps {
  onAddMCQ: (mcq: MCQ) => void
  onBack: () => void
  isFirstMCQ: boolean
  standardTimer: number
  onSetStandardTimer: (timer: number) => void
}

export default function MCQCreator({
  onAddMCQ,
  onBack,
  isFirstMCQ,
  standardTimer,
  onSetStandardTimer,
}: MCQCreatorProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [correctOption, setCorrectOption] = useState(0)
  const [timer, setTimer] = useState(isFirstMCQ ? 30 : standardTimer)
  const [useStandardTimer, setUseStandardTimer] = useState(!isFirstMCQ)
  const [isCustomizingTimer, setIsCustomizingTimer] = useState(false)

  useEffect(() => {
    if (!isFirstMCQ && !isCustomizingTimer) {
      setTimer(standardTimer)
    }
  }, [standardTimer, isFirstMCQ, isCustomizingTimer])

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
    if (correctOption >= index) {
      setCorrectOption(Math.max(0, correctOption - 1))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddMCQ = (andCreateNew: boolean) => {
    if (question && options.every((option) => option.trim() !== "")) {
      const newMCQ: MCQ = {
        id: Math.random().toString(36).substr(2, 9),
        question,
        options: options.filter((option) => option.trim() !== ""),
        correctOption,
        timer: useStandardTimer ? standardTimer : timer,
      }
      onAddMCQ(newMCQ)
      if (isFirstMCQ && useStandardTimer) {
        onSetStandardTimer(timer)
      }
      if (andCreateNew) {
        setQuestion("")
        setOptions(["", ""])
        setCorrectOption(0)
        setTimer(standardTimer)
        setUseStandardTimer(true)
        setIsCustomizingTimer(false)
      } else {
        onBack()
      }
    }
  }

  const isValid = question.trim() !== "" && options.every((option) => option.trim() !== "")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an MCQ</CardTitle>
        <CardDescription>Add questions, options, and set the correct answer for your MCQ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mcq-question">Question</Label>
            <Input
              id="mcq-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your MCQ question"
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button variant="outline" onClick={() => removeOption(index)} disabled={options.length <= 2}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addOption} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correct-option">Correct Option</Label>
            <Select value={correctOption.toString()} onValueChange={(value) => setCorrectOption(Number(value))}>
              <SelectTrigger id="correct-option">
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Option {index + 1}: {option || `(empty)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timer Settings</Label>
            {isFirstMCQ ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={timer}
                  onChange={(e) => setTimer(Number(e.target.value))}
                  min={5}
                  max={300}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-standard-timer"
                    checked={useStandardTimer}
                    onCheckedChange={(checked) => setUseStandardTimer(checked as boolean)}
                  />
                  <Label htmlFor="use-standard-timer">Set as standard timer for all MCQs</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {isCustomizingTimer ? (
                  <Input
                    type="number"
                    value={timer}
                    onChange={(e) => setTimer(Number(e.target.value))}
                    min={5}
                    max={300}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <span>Standard timer: {standardTimer} seconds</span>
                    <Button variant="outline" onClick={() => setIsCustomizingTimer(true)}>
                      Customize Timer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <div className="space-x-2">
          <Button onClick={() => handleAddMCQ(true)} disabled={!isValid}>
            Save & Create Another
          </Button>
          <Button onClick={() => handleAddMCQ(false)} disabled={!isValid} variant="outline">
            Save & Return
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

