import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Score from "@/models/Score"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { score, genre, correctAnswers, totalQuestions } = body

    if (!score || !genre || correctAnswers === undefined || !totalQuestions) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ googleId: session.user.id })
    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const scoreRecord = await Score.create({
      userId: user._id,
      score,
      genre,
      correctAnswers,
      totalQuestions,
    })

    if (score > user.highScore) {
      user.highScore = score
      await user.save()
    }

    return NextResponse.json({ success: true, score: scoreRecord })
  } catch (error) {
    console.error("[SCORE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    await dbConnect()

    const query = genre ? { genre } : {}

    const scores = await Score.find(query)
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'nickname name')

    const total = await Score.countDocuments(query)

    return NextResponse.json({
      scores,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      }
    })
  } catch (error) {
    console.error("[SCORE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 