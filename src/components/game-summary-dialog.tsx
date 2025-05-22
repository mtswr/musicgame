import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TrackResult {
  name: string;
  artists: string[];
  timeToGuess: number;
  correct: boolean;
  albumCover?: string;
  segment: number;
  trackId?: string;
}

interface GameSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedTracks: TrackResult[];
  segmentsLength: number;
  onPlayAgain: () => void;
}

export function GameSummaryDialog({
  open,
  onOpenChange,
  completedTracks,
  segmentsLength,
  onPlayAgain
}: GameSummaryDialogProps) {
  const uniqueTracks = completedTracks.reduce<TrackResult[]>((acc, track) => {
    const isDuplicate = acc.some(t =>
      (track.trackId && t.trackId === track.trackId) ||
      (t.name === track.name && t.artists.join(',') === track.artists.join(','))
    );

    if (!isDuplicate) {
      acc.push(track);
    }
    return acc;
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-500">Game Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <h2 className="text-center text-lg font-bold">You completed all {uniqueTracks.length} tracks!</h2>

          <div className="flex flex-col gap-4">
            {uniqueTracks.map((track, index) => (
              <div key={index} className="bg-zinc-800/10 border border-zinc-700 rounded-lg p-4">
                <div className="flex gap-4 items-center">
                  {track.albumCover ? (
                    <img
                      src={track.albumCover}
                      alt="Album Cover"
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-zinc-500">No Cover</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{track.name}</h3>
                    <p className="text-sm text-zinc-400">for {track.artists.join(' & ')}</p>
                    <div className={`font-semibold tracking-[0.2em] ${track.correct ? 'text-emerald-500' : 'text-red-500'} mt-1`}>
                      {track.correct ? 'CORRECT' : 'WRONG'}
                    </div>
                    <div className="flex text-zinc-400 mt-1">
                      <span>Time:</span>
                      <span>{track.timeToGuess}s</span>
                    </div>
                    <div className="flex text-zinc-400">
                      <span>Segment:</span>
                      <span>{track.segment + 1}/{segmentsLength}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={onPlayAgain}
              className="bg-emerald-600 hover:bg-emerald-700 text-emerald-100"
            >
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 