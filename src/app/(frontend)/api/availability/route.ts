import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marqueeId = searchParams.get('marqueeId')

    if (!marqueeId) {
      return NextResponse.json(
        { error: 'Marquee ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Get availability for the next 90 days
    const today = new Date()
    const endDate = new Date()
    endDate.setDate(today.getDate() + 90)

    const availability = await payload.find({
      collection: 'availability',
      where: {
        marquee: {
          equals: marqueeId,
        },
        date: {
          greater_than_equal: today.toISOString().split('T')[0],
          less_than_equal: endDate.toISOString().split('T')[0],
        },
      },
      sort: 'date',
      limit: 1000,
    })

    // Transform the data for the frontend
    const availabilityData = availability.docs.map((record) => ({
      date: record.date,
      isAvailable: record.isAvailable,
      price: record.price,
    }))

    return NextResponse.json({
      availability: availabilityData,
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
} 