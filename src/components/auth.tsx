"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChromeIcon as Google } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const usernameSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores are allowed")
})

type UsernameForm = z.infer<typeof usernameSchema>

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { data: session, status, update } = useSession()
  const [showNicknameForm, setShowNicknameForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UsernameForm>({
    resolver: zodResolver(usernameSchema)
  })

  const handleGoogleLogin = async () => {
    try {
      await signIn("google")
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: window.location.href })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const onSubmitUsername = async (data: UsernameForm) => {
    try {
      const response = await fetch('/api/user/nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          nickname: data.username
        }),
      })

      if (response.ok) {
        await update({
          ...session,
          user: {
            ...session?.user,
            nickname: data.username
          }
        })
        setShowNicknameForm(false)
        onClose()
      } else {
        console.error('Erro ao salvar nickname')
      }
    } catch (error) {
      console.error('Erro ao salvar nickname:', error)
    }
  }

  if (session && !session.user?.nickname && !showNicknameForm) {
    setShowNicknameForm(true)
  }

  if (session && !showNicknameForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-[#1E1E1E] border-[#333333] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-white">
              Seu Perfil
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.nickname || session.user?.name || ""} />
              <AvatarFallback>{session.user?.nickname?.charAt(0) || session.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white">{session.user?.nickname || session.user?.name}</h3>
              <p className="text-sm text-gray-400">{session.user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Sair
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (showNicknameForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-[#1E1E1E] border-[#333333] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-white">
              Escolha seu nickname
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitUsername)} className="flex flex-col gap-4 py-6">
            <div>
              <label className="block text-white text-sm mb-2">
                Por favor, escolha um nickname para continuar
              </label>
              <Input
                {...register("username")}
                placeholder="nickname"
                className="bg-[#2A2A2A] border-[#333333] text-white"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2A2A2A] hover:bg-[#333333] text-white"
            >
              Continuar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1E1E1E] border-[#333333] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-white">
            Entre na sua conta
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <Button
            className="w-full max-w-xs flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] text-white"
            onClick={handleGoogleLogin}
          >
            <Google className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

