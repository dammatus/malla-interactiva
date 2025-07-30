import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, code, credits, yearId, prerequisites } = await request.json()

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        credits,
        yearId,
        prerequisites: {
          create:
            prerequisites?.map((prereqId: string) => ({
              prerequisiteId: prereqId,
            })) || [],
        },
      },
      include: {
        prerequisites: {
          include: {
            prerequisiteSubject: true,
          },
        },
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
