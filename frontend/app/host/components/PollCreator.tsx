"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"

interface Poll {
  id: string
  question: string
  options: string[]
}

interface PollCreatorProps {
  onAddPoll: (poll: Poll) => void
  onBack: () => void
}

export default function PollCreator({ onAddPoll, onBack }: PollCreatorProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddPoll = (andCreateNew: boolean) => {
    if (question && options.every((option) => option.trim() !== "")) {
      const newPoll: Poll = {
        id: Math.random().toString(36).substr(2, 9),
        question,
        options: options.filter((option) => option.trim() !== ""),
      }
      onAddPoll(newPoll)
      if (andCreateNew) {
        setQuestion("")
        setOptions(["", ""])
      } else {
        onBack()
      }
    }
  }

  const isValid = question.trim() !== "" && options.every((option) => option.trim() !== "")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Poll</CardTitle>
        <CardDescription>Add questions and options for your poll.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="poll-question">Question</Label>
          <Input
            id="poll-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <div className="space-x-2">
          <Button onClick={() => handleAddPoll(true)} disabled={!isValid}>
            Save & Create Another
          </Button>
          <Button onClick={() => handleAddPoll(false)} disabled={!isValid} variant="outline">
            Save & Return
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

