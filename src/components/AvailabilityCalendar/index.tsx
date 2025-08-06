'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import type { DateRange } from 'react-day-picker'

interface AvailabilityCalendarProps {
  marqueeId: string
  onDateSelection: (startDate: Date, endDate: Date) => void
  basePrice?: number
}

interface AvailabilityData {
  date: string
  isAvailable: boolean
  price?: number
}

export function AvailabilityCalendar({
  marqueeId,
  onDateSelection,
  basePrice = 0,
}: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    fetchAvailability()
  }, [marqueeId])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/availability?marqueeId=${marqueeId}`)
      if (response.ok) {
        const data = await response.json()
        setAvailability(data.availability)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    setSelectedRange(range)
  }

  const handleBooking = () => {
    if (selectedRange?.from && selectedRange?.to) {
      onDateSelection(selectedRange.from, selectedRange.to)
    }
  }

  const isDateAvailable = (date: Date) => {
    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of today
    if (date < today) {
      return false
    }

    const dateStr = date.toISOString().split('T')[0]
    const availabilityRecord = availability.find((a) => a.date === dateStr)
    return availabilityRecord?.isAvailable ?? true
  }

  const getDatePrice = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const availabilityRecord = availability.find((a) => a.date === dateStr)
    // Use override price if available, otherwise use base price
    return availabilityRecord?.price ?? basePrice
  }

  const calculateTotalPrice = () => {
    if (!selectedRange?.from || !selectedRange?.to) return 0

    const start = new Date(selectedRange.from)
    const end = new Date(selectedRange.to)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    let total = 0
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + i)
      const price = getDatePrice(currentDate)
      total += price || 0 // Use 0 if price is undefined
    }

    return total
  }

  const daysInRange =
    selectedRange?.from && selectedRange?.to
      ? Math.ceil(
          (selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Event Dates</h3>
          <p className="text-sm text-gray-600">
            Choose your preferred dates for your marquee booking
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Book from today up to 2 years in advance • Past dates are not available
          </p>
        </div>
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleDateSelect}
          disabled={(date) => !isDateAvailable(date)}
          className="w-full"
          showOutsideDays={true}
          fromDate={new Date()}
          toDate={new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)} // 2 years from now
          captionLayout="dropdown"
          defaultMonth={new Date()}
          formatters={{
            formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'long' }),
            formatYearDropdown: (date) => date.toLocaleString('default', { year: 'numeric' }),
          }}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 2}
        />
      </div>

      {/* Selection Summary */}
      {selectedRange?.from && selectedRange?.to && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Dates</h3>
          <div className="text-sm text-gray-600 mb-3">
            {selectedRange.from.toLocaleDateString()} - {selectedRange.to.toLocaleDateString()}
            <span className="ml-2 text-blue-600 font-medium">({daysInRange} days)</span>
          </div>

          <div className="text-lg font-bold text-green-600">
            Total: £{calculateTotalPrice()}
            {basePrice > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (£{basePrice} per day base price)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Booking Button */}
      <Button
        onClick={handleBooking}
        disabled={!selectedRange?.from || !selectedRange?.to}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedRange?.from && selectedRange?.to
          ? 'Continue to Booking Details'
          : 'Select Dates to Continue'}
      </Button>

      {/* Availability Legend */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          Available for Booking
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
          Already Booked or Past Date
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
          Selected Dates
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
          Booking Period
        </div>
      </div>
    </div>
  )
}
