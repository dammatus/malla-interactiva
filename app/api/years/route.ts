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

    const { number, name, curriculumId } = await request.json()

    const year = await prisma.year.create({
      data: {
        number,
        name,
        curriculumId,
      },
    })

    return NextResponse.json(year)
  } catch (error) {
    console.error("Error creating year:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
