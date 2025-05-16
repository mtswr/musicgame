import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface GameResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    name: string;
    artists: string[];
    timeToGuess: number;
    correct: boolean;
    albumCover?: string;
    segment: number;
  } | null;
  onNext: () => void;
  segmentsLength: number;
}

export function GameResultDialog({
  open,
  onOpenChange,
  result,
  onNext,
  segmentsLength
}: GameResultDialogProps) {
  // Handler para o clique no botão Next Track que previne efeitos colaterais
  const handleNextTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-500">Track Result</DialogTitle>
        </DialogHeader>
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {result.albumCover ? (
                <img
                  src={result.albumCover}
                  alt="Album Cover"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-500">No Cover</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold">{result.name}</h3>
              <p className="text-zinc-400">{result.artists.join(', ')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400">Time to guess:</p>
              <p className="text-lg font-bold text-emerald-500">
                {result.timeToGuess}s
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleNextTrack}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next Track
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 