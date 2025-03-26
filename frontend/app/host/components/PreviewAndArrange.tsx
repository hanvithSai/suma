"use client"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2, ChevronUp, ChevronDown } from "lucide-react"

interface ContentItem {
  id: string
  type: "poll" | "mcq"
  question: string
  options: string[]
  correctOption?: number
  timer?: number
}

interface PreviewAndArrangeProps {
  content: ContentItem[]
  onUpdateContent: (content: ContentItem[]) => void
  onBack: () => void
  onSave: () => void
  onPresent: () => void
}

export default function PreviewAndArrange({
  content,
  onUpdateContent,
  onBack,
  onSave,
  onPresent,
}: PreviewAndArrangeProps) {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const newContent = Array.from(content)
    const [reorderedItem] = newContent.splice(result.source.index, 1)
    newContent.splice(result.destination.index, 0, reorderedItem)

    onUpdateContent(newContent)
  }

  const handleDelete = (index: number) => {
    const newContent = [...content]
    newContent.splice(index, 1)
    onUpdateContent(newContent)
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    const newContent = [...content]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < content.length) {
      ;[newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]]
      onUpdateContent(newContent)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview and Arrange</CardTitle>
        <CardDescription>Drag and drop or use arrows to rearrange the order of questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {content.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Card className="relative">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center">
                              <span className="mr-4 text-lg font-semibold">{index + 1}.</span>
                              <CardTitle>{item.type === "poll" ? "Poll" : "MCQ"}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.timer && <span className="text-sm">Timer: {item.timer}s</span>}
                              <div className="flex flex-col">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveItem(index, "up")}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveItem(index, "down")}
                                  disabled={index === content.length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="font-semibold">{item.question}</p>
                            <ul className="list-disc pl-5 mt-2">
                              {item.options.map((option, optionIndex) => (
                                <li key={optionIndex}>
                                  {option}
                                  {item.type === "mcq" && optionIndex === item.correctOption && " (Correct)"}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <div className="space-x-2">
          <Button onClick={onSave} variant="outline">
            Save
          </Button>
          <Button onClick={onPresent}>Present</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

