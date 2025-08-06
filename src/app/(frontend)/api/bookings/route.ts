import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      marqueeId,
      startDate,
      endDate,
      customer,
      event,
      setup,
    } = body

    const payload = await getPayload({ config: configPromise })

    // First, create or find the customer
    let customerRecord
    try {
      // Try to find existing customer by email
      const existingCustomer = await payload.find({
        collection: 'customers',
        where: {
          email: {
            equals: customer.email,
          },
        },
        limit: 1,
      })

      if (existingCustomer.docs.length > 0) {
        customerRecord = existingCustomer.docs[0]
        // Update customer information
        await payload.update({
          collection: 'customers',
          id: customerRecord.id,
          data: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            company: customer.company,
            address: customer.address,
          },
        })
      } else {
        // Create new customer
        customerRecord = await payload.create({
          collection: 'customers',
          data: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            company: customer.company,
            address: customer.address,
            isActive: true,
          },
        })
      }
    } catch (error) {
      console.error('Error handling customer:', error)
      return NextResponse.json(
        { error: 'Failed to process customer information' },
        { status: 500 }
      )
    }

    // Get the marquee to calculate pricing
    const marquee = await payload.findByID({
      collection: 'marquees',
      id: marqueeId,
    })

    if (!marquee) {
      return NextResponse.json(
        { error: 'Marquee not found' },
        { status: 404 }
      )
    }

    // Calculate pricing
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    const dailyRate = marquee.price
    const subtotal = dailyRate * days
    const totalPrice = subtotal // No discount applied initially
    const deposit = totalPrice * 0.25 // 25% deposit
    const balance = totalPrice - deposit

    // Create the booking
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        bookingNumber: 'TEMP', // Will be overridden by the hook
        customer: customerRecord.id,
        marquee: marqueeId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        setupTime: setup.setupTime ? new Date(setup.setupTime).toISOString() : null,
        teardownTime: setup.teardownTime ? new Date(setup.teardownTime).toISOString() : null,
        status: 'pending',
        paymentStatus: 'pending',
        pricing: {
          dailyRate,
          numberOfDays: days,
          subtotal,
          discount: 0,
          totalPrice,
        },
        payments: {
          deposit,
          depositPaid: false,
          balance,
          balancePaid: false,
        },
        specialRequirements: event.specialRequirements,
        eventDetails: {
          eventType: event.type,
          guestCount: event.guestCount,
          location: event.location,
        },
        notes: 'Booking created via website',
      },
    })

    // TODO: Send confirmation email to customer
    // TODO: Send notification email to admin

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      message: 'Booking created successfully',
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 