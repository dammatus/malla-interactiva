import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { approved, name, code, credits } = await request.json()

    const subject = await prisma.subject.update({
      where: { id: params.id },
      data: {
        ...(approved !== undefined && { approved }),
        ...(name && { name }),
        ...(code && { code }),
        ...(credits && { credits }),
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
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.subject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
