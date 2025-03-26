"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Progress } from "@/app/components/ui/progress"

// Sample data
const sampleMCQ = {
  question: "Which of the following is not a JavaScript framework?",
  options: ["React", "Vue", "Angular", "Django"],
  timer: 30,
  correctOption: 3,
}

export default function RespondToMCQ() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(sampleMCQ.timer)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      setIsSubmitted(true)
      setTimeout(() => setShowAnswer(true), 1000)
    }
  }, [timeLeft, isSubmitted])

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true)
      // In a real app, you would send this to the server
      console.log("Submitted MCQ answer:", selectedOption)
      setTimeout(() => setShowAnswer(true), 1000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple Choice Question</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{sampleMCQ.question}</p>

        {!isSubmitted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Time remaining</span>
              <span>{timeLeft} seconds</span>
            </div>
            <Progress value={(timeLeft / sampleMCQ.timer) * 100} />
          </div>
        )}

        {showAnswer ? (
          <div className="space-y-4">
            <p className="font-medium text-green-600">
              {selectedOption === sampleMCQ.options[sampleMCQ.correctOption]
                ? "Correct! Well done!"
                : "Incorrect. Better luck next time!"}
            </p>
            <div className="space-y-2">
              {sampleMCQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === sampleMCQ.correctOption
                      ? "bg-green-50 border border-green-200"
                      : option === selectedOption
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50"
                  }`}
                >
                  <span>{option}</span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      index === sampleMCQ.correctOption
                        ? "bg-green-100 text-green-800"
                        : option === selectedOption && index !== sampleMCQ.correctOption
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {index === sampleMCQ.correctOption
                      ? "Correct"
                      : option === selectedOption && index !== sampleMCQ.correctOption
                        ? "Your choice"
                        : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} disabled={isSubmitted}>
              {sampleMCQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`mcq-option-${index}`} disabled={isSubmitted} />
                  <Label htmlFor={`mcq-option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button className="mt-4" disabled={!selectedOption || isSubmitted} onClick={handleSubmit}>
              {isSubmitted ? "Submitted" : "Submit Answer"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

