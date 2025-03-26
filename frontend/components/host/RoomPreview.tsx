import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RoomPreviewProps {
  roomName: string
  roomCode: string
  polls: { question: string; options: string[] }[]
  mcqs: { question: string; options: string[]; correctOption: number; timer: number }[]
  onBack: () => void
  onPresent: () => void
}

export default function RoomPreview({ roomName, roomCode, polls, mcqs, onBack, onPresent }: RoomPreviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Preview</CardTitle>
          <CardDescription>Review your room details before presenting.</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold">Room Details</h3>
          <p>
            <strong>Name:</strong> {roomName}
          </p>
          <p>
            <strong>Code:</strong> {roomCode}
          </p>

          <h3 className="text-lg font-semibold mt-4">Polls</h3>
          {polls.map((poll, index) => (
            <Card key={index} className="mt-2">
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {poll.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          <h3 className="text-lg font-semibold mt-4">MCQs</h3>
          {mcqs.map((mcq, index) => (
            <Card key={index} className="mt-2">
              <CardHeader>
                <CardTitle>{mcq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {mcq.options.map((option, optionIndex) => (
                    <li key={optionIndex} className={optionIndex === mcq.correctOption ? "font-bold" : ""}>
                      {option} {optionIndex === mcq.correctOption && "(Correct)"}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">Timer: {mcq.timer} seconds</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onBack}>Back</Button>
          <Button onClick={onPresent}>Present</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

