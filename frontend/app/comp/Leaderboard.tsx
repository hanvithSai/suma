import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Medal, Trophy } from "lucide-react"

interface LeaderboardEntry {
  id: number
  name: string
  avatar: string
  score: number
  rank: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title?: string
  className?: string
}

export default function Leaderboard({ entries, title = "Leaderboard", className = "" }: LeaderboardProps) {
  // Sort entries by score (highest first)
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score)

  // Get top 3 for special styling
  const topThree = sortedEntries.slice(0, 3)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-3 bg-primary/5 rounded-t-md">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <span>Rank</span>
            <span>Participant</span>
            <span>Score</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {sortedEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`leaderboard-item hover:bg-secondary ${
                index === 0 ? "bg-yellow-500/10" : index === 1 ? "bg-gray-300/10" : index === 2 ? "bg-amber-600/10" : ""
              }`}
            >
              <div
                className={`leaderboard-rank ${
                  index === 0
                    ? "bg-yellow-500/20 text-yellow-500"
                    : index === 1
                      ? "bg-gray-300/20 text-gray-300"
                      : index === 2
                        ? "bg-amber-600/20 text-amber-600"
                        : "bg-secondary text-muted-foreground"
                }`}
              >
                {index === 0 ? (
                  <Medal className="h-4 w-4" />
                ) : index === 1 ? (
                  <Medal className="h-4 w-4" />
                ) : index === 2 ? (
                  <Medal className="h-4 w-4" />
                ) : (
                  entry.rank
                )}
              </div>
              <div className="leaderboard-user">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{entry.name}</span>
              </div>
              <div className="leaderboard-score">{entry.score}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

