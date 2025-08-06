'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Search, Calendar as CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

interface HomeSearchProps {
  className?: string
}

export function HomeSearch({ className }: HomeSearchProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (selectedRange?.from && selectedRange?.to) {
      const fromDate = selectedRange.from.toISOString().split('T')[0]
      const toDate = selectedRange.to.toISOString().split('T')[0]
      router.push(`/search?from=${fromDate}&to=${toDate}`)
    }
  }

  const formatDateRange = () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      return 'Select your event dates'
    }
    return `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`
  }

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      {/* Search Bar */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center">
        {/* Date Selection Button */}
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">{formatDateRange()}</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!selectedRange?.from || !selectedRange?.to}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Marquees
        </Button>
      </div>

      {/* Calendar Dropdown */}
      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Event Dates</h3>
            <p className="text-sm text-gray-600">
              Choose your preferred dates for your marquee booking
            </p>
          </div>

          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
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

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button onClick={() => setShowCalendar(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowCalendar(false)
                handleSearch()
              }}
              disabled={!selectedRange?.from || !selectedRange?.to}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Search Available Marquees
            </Button>
          </div>
        </div>
      )}

      {/* Overlay to close calendar when clicking outside */}
      {showCalendar && (
        <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
      )}
    </div>
  )
}
