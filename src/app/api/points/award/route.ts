import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { awardPoints } from '@/lib/points'

export async function POST(request: Request) {
  try {
    const { memberId, actionType, metadata } = await request.json()

    if (!memberId || !actionType) {
      return NextResponse.json(
        { error: 'memberId and actionType are required' },
        { status: 400 }
      )
    }

    // Ensure member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const result = await awardPoints(memberId, actionType, metadata)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      points: result.points,
      message: result.message,
    })
  } catch (error) {
    console.error('Error awarding points:', error)
    return NextResponse.json(
      { error: 'Failed to award points' },
      { status: 500 }
    )
  }
}
