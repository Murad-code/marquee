'use client'

import type { Marquee } from '@/payload-types'
import { useState } from 'react'
import Link from 'next/link'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'
import { BookingForm } from '@/components/BookingForm'
import { ImageCarousel } from '@/components/ImageCarousel'

interface MarqueeDetailProps {
  marquee: Marquee
}

export function MarqueeDetail({ marquee }: MarqueeDetailProps) {
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: null,
    endDate: null,
  })

  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleDateSelection = (startDate: Date, endDate: Date) => {
    setSelectedDates({ startDate, endDate })
    setShowBookingForm(true)
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/marquees" className="hover:text-blue-600">
              Marquees
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{marquee.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Images and Details */}
        <div>
          {/* Image Gallery */}
          <div className="mb-8">
            <ImageCarousel
              images={marquee.images || []}
              title={marquee.name}
              showAvailableBadge={true}
            />
          </div>

          {/* Marquee Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{marquee.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{marquee.description}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{marquee.capacity}</div>
                <div className="text-sm text-gray-600">Guests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">£{marquee.price}</div>
                <div className="text-sm text-gray-600">per day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{marquee.setupTime}</div>
                <div className="text-sm text-gray-600">hours setup</div>
              </div>
            </div>

            {/* Dimensions */}
            {marquee.dimensions && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dimensions</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marquee.dimensions.width}m
                    </div>
                    <div className="text-sm text-gray-600">Width</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marquee.dimensions.length}m
                    </div>
                    <div className="text-sm text-gray-600">Length</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {marquee.dimensions.height}m
                    </div>
                    <div className="text-sm text-gray-600">Height</div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {marquee.features && marquee.features.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {marquee.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Availability and Booking */}
        <div>
          <div className="sticky top-24">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Availability & Book</h2>

              {!showBookingForm ? (
                <AvailabilityCalendar
                  marqueeId={marquee.id.toString()}
                  onDateSelection={handleDateSelection}
                  basePrice={marquee.price}
                />
              ) : (
                <BookingForm
                  marquee={marquee}
                  selectedDates={selectedDates}
                  onBack={() => setShowBookingForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
