import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DollarSign, Bitcoin } from "lucide-react"

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-md bg-[#323437] border-[#3c3e41] text-gray-200 font-mono p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-center text-gray-300">Support Melodymaster</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center">
            Thank you so much for thinking about supporting this project.
          </p>

          {/* Change to a single column on mobile, 2 columns on small screens, 4 on medium+ */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {/* Mobile: horizontal layout with icon and text side by side */}
            {/* Desktop: vertical layout with icon above text */}
            <div className="flex flex-row sm:flex-col items-center p-3 sm:p-4 bg-[#232427] rounded-md hover:bg-[#2c2e31] transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center sm:mb-2 mr-3 sm:mr-0 text-gray-300">
                <div className="bg-[#232427] border border-gray-600 rounded p-1">
                  <span className="text-xs font-bold">Ad</span>
                </div>
              </div>
              <span className="text-sm text-gray-400">Enable Ads</span>
            </div>

            <div className="flex flex-row sm:flex-col items-center p-3 sm:p-4 bg-[#232427] rounded-md hover:bg-[#2c2e31] transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center sm:mb-2 mr-3 sm:mr-0 text-gray-300">
                <Bitcoin className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm text-gray-400">Donate Crypto</span>
            </div>

            <div className="flex flex-row sm:flex-col items-center p-3 sm:p-4 bg-[#232427] rounded-md hover:bg-[#2c2e31] transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center sm:mb-2 mr-3 sm:mr-0 text-gray-300">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm text-gray-400">Donate</span>
            </div>

            <div className="flex flex-row sm:flex-col items-center p-3 sm:p-4 bg-[#232427] rounded-md hover:bg-[#2c2e31] transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center sm:mb-2 mr-3 sm:mr-0 text-gray-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400">Join Patreon</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

