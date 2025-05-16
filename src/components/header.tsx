"use client"

import { User, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import LoginModal from "@/components/auth"

export default function Header() {
  // const [authOpen, setAuthOpen] = useState(false)

  return (
    <div>
      <header className="max-w-2xl mx-auto p-6">
        <div className=" flex items-center justify-center">
          <Link href="/">
            <div className="text-xl font-bold tracking-wider text-emerald-500 cursor-pointer">MusicGame</div>
          </Link>
          {/* <div className="flex items-center gap-4">
            <Link href="/ladder">
              <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-amber-500">
                <Crown className="w-5 h-5" />
                <span className="sr-only">Leaderboard</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-emerald-500" onClick={() => setAuthOpen(true)}>
              <User className="w-5 h-5" />
              <span className="sr-only">User account</span>
            </Button>

          </div> */}
        </div>
      </header>
      {/* <LoginModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      /> */}
    </div>
  )
}

