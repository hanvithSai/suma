"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"

// Sample data
const samplePoll = {
  question: "What's your favorite programming language?",
  options: ["JavaScript", "Python", "Java", "C++"],
}

export default function RespondToPoll() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true)
      // In a real app, you would send this to the server
      console.log("Submitted poll answer:", selectedOption)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{samplePoll.question}</p>
        {isSubmitted ? (
          <div className="space-y-4">
            <p className="font-medium text-green-600">Your response has been recorded!</p>
            <div className="space-y-2">
              {samplePoll.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <span>{option}</span>
                  <span className="text-sm font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                    {option === selectedOption ? "Your choice" : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Waiting for results from the host...</p>
          </div>
        ) : (
          <>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              {samplePoll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`poll-option-${index}`} />
                  <Label htmlFor={`poll-option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button className="mt-4" disabled={!selectedOption} onClick={handleSubmit}>
              Submit Vote
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

