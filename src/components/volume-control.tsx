"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface VolumeControlProps {
  audioRef: React.RefObject<HTMLAudioElement | null>
  className?: string
}

export function VolumeControl({ audioRef, className }: VolumeControlProps) {
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted, audioRef])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={toggleMute}
        className="text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>
      <SliderPrimitive.Root
        defaultValue={[0.7]}
        value={[isMuted ? 0 : volume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="relative flex w-24 touch-none items-center select-none"
      >
        <SliderPrimitive.Track
          className="bg-zinc-700 relative grow overflow-hidden rounded-full h-1.5 w-full"
        >
          <SliderPrimitive.Range
            className="bg-emerald-500 absolute h-full"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block size-3 rounded-full border border-emerald-500 bg-zinc-100 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none"
        />
      </SliderPrimitive.Root>
    </div>
  )
} 