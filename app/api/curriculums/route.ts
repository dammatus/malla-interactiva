import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const curriculums = await prisma.curriculum.findMany({
      where: { userId: user.id },
      include: {
        years: {
          include: {
            subjects: {
              include: {
                prerequisites: {
                  include: {
                    prerequisiteSubject: true,
                  },
                },
              },
            },
          },
          orderBy: { number: "asc" },
        },
      },
    })

    return NextResponse.json(curriculums)
  } catch (error) {
    console.error("Error fetching curriculums:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { name, description } = await request.json()

    const curriculum = await prisma.curriculum.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    })

    return NextResponse.json(curriculum)
  } catch (error) {
    console.error("Error creating curriculum:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
