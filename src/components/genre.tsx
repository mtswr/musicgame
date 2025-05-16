"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Genre() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const router = useRouter();

  const genres = [
    "rock",
    "metal",
    "pop",
    "hip-hop",
    "electronic",
    "mpb",
    "jazz",
    "country",
  ]

  useEffect(() => {
    if (selectedGenre) {
      router.push(`/game?genre=${selectedGenre}`);
    }
  }, [selectedGenre, router]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full mt-4">
      {genres.map((genre) => (
        <div
          key={genre}
          onClick={() => setSelectedGenre(genre)}
          className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center justify-between gap-3 text-amber-500 cursor-pointer hover:bg-zinc-800"
        >
          <span className="tracking-[0.2em] text-sm">
            <span className="mr-2">▶</span> {genre}
          </span>
        </div>
      ))}
    </div>
  )
}