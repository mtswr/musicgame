import Link from "next/link"
import { Mail, Github, MessageSquare, Twitter, FileText, Shield, Lock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-3 px-4">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Mail className="w-4 h-4" />
          <span>contact</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <MessageSquare className="w-4 h-4" />
          <span>support</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Github className="w-4 h-4" />
          <span>github</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <MessageSquare className="w-4 h-4" />
          <span>discord</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Twitter className="w-4 h-4" />
          <span>twitter</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <FileText className="w-4 h-4" />
          <span>terms</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Shield className="w-4 h-4" />
          <span>security</span>
        </Link>
        <Link href="#" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <Lock className="w-4 h-4" />
          <span>privacy</span>
        </Link>
      </div>
    </footer>
  )
}

