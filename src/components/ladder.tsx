"use client"

import { useState } from "react"
import { Crown, ChevronLeft, ChevronRight, Hash } from "lucide-react"

export default function Leaderboard() {
  const [timeLeft, setTimeLeft] = useState("01:48")

  const leaderboardData = [
    {
      id: 1,
      name: "rocket",
      badge: "Mythical",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "27 Aug 2023",
      avatar: "/placeholder.svg?height=24&width=24",
      isFirst: true,
    },
    {
      id: 2,
      name: "fallenrelic",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "25 Dec 2024",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 3,
      name: "saerith",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "25 Jun 2023",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 4,
      name: "joshua728",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "25 Jun 2023",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 5,
      name: "APackOfSmarties",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "18 Dec 2024",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 6,
      name: "Whats_A_Father",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "27 Jan 2025",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 7,
      name: "slekap",
      badge: "OG Account",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "11 Nov 2021",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 8,
      name: "caribou",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "03 Dec 2024",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 9,
      name: "XDmoment",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "19 Jan 2025",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 10,
      name: "hiimnotgood",
      badge: "OG Account",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "11 May 2024",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 11,
      name: "hotmama",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "11 Jan 2025",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      id: 12,
      name: "shazity",
      timeInSeconds: 108,
      accuracyScore: 5,
      date: "02 Jul 2023",
      avatar: "/placeholder.svg?height=24&width=24",
    },
  ]

  return (
    <div className="min-h-screen text-gray-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl ">All-time Leaderboard</h1>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">Next update in: {timeLeft}</div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <button className="p-2 rounded hover:bg-gray-800">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-gray-800">
                <Hash className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-gray-800">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-800">
                  <th className="py-2 px-4 w-12">#</th>
                  <th className="py-2 px-4">name</th>
                  <th className="py-2 px-4 text-center">accuracy</th>
                  <th className="py-2 px-4 text-center">time</th>
                  <th className="py-2 px-4 text-right">date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-mono">
                      {user.isFirst ? <Crown className="w-5 h-5 text-yellow-400" /> : user.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="">{user.name}</span>
                        {user.badge && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${user.badge === "Mythical"
                              ? "bg-purple-900/50 text-purple-300 border border-purple-700"
                              : "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                              }`}
                          >
                            {user.badge === "Mythical" ? "✦ Mythical" : "✪ OG Account"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{user.accuracyScore}/5</td>
                    <td className="py-3 px-4 text-center font-mono ">{user.timeInSeconds}</td>
                    <td className="py-3 px-4 text-right font-mono">{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

