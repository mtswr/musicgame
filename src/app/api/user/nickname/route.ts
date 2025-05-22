import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { nickname } = body

    if (!nickname) {
      return new NextResponse("Nickname is required", { status: 400 })
    }
    await dbConnect()

    const existingUserWithNickname = await User.findOne({ nickname })
    if (existingUserWithNickname) {
      return new NextResponse("Nickname already taken", { status: 400 })
    }

    const user = await User.findOneAndUpdate(
      { googleId: session.user.id },
      {
        $setOnInsert: {
          googleId: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        $set: {
          nickname: nickname,
        }
      },
      {
        upsert: true,
        new: true,
      }
    )

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[NICKNAME_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 