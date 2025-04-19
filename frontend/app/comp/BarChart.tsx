"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

interface BarChartProps {
  data: {
    label: string
    value: number
    color?: string
  }[]
  title?: string
  showValues?: boolean
  showPercentages?: boolean
  showLabels?: boolean
  maxValue?: number
  className?: string
  animated?: boolean
}

export default function BarChart({
  data,
  title,
  showValues = true,
  showPercentages = true,
  showLabels = true,
  maxValue,
  className = "",
  animated = true,
}: BarChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>(data.map(() => 0))

  // Calculate the maximum value for scaling
  const calculatedMax = maxValue || Math.max(...data.map((item) => item.value), 1)

  // Calculate percentages
  const percentages = data.map((item) => (item.value / calculatedMax) * 100)

  // Default colors if not provided
  const defaultColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  useEffect(() => {
    if (animated) {
      // Animate the bars on mount
      const timer = setTimeout(() => {
        setAnimatedValues(percentages)
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setAnimatedValues(percentages)
    }
  }, [data, percentages, animated])

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              {showLabels && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  {showValues && (
                    <span className="text-muted-foreground">
                      {item.value}
                      {showPercentages && ` (${Math.round(percentages[index])}%)`}
                    </span>
                  )}
                </div>
              )}
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`bar-chart-bar h-full ${item.color || defaultColors[index % defaultColors.length]}`}
                  style={{ width: `${animatedValues[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

