'use client'

import type { Marquee } from '@/payload-types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BookingFormProps {
  marquee: Marquee
  selectedDates: {
    startDate: Date | null
    endDate: Date | null
  }
  onBack: () => void
}

interface BookingData {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
    address: {
      street: string
      city: string
      postcode: string
    }
  }
  event: {
    type: string
    guestCount: number
    location: string
    specialRequirements: string
  }
  setup: {
    setupTime: Date | null
    teardownTime: Date | null
  }
}

export function BookingForm({ marquee, selectedDates, onBack }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: {
        street: '',
        city: '',
        postcode: '',
      },
    },
    event: {
      type: '',
      guestCount: 0,
      location: '',
      specialRequirements: '',
    },
    setup: {
      setupTime: null,
      teardownTime: null,
    },
  })

  const updateBookingData = (section: keyof BookingData, field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateAddress = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        address: {
          ...prev.customer.address,
          [field]: value,
        },
      },
    }))
  }

  const calculateTotalPrice = () => {
    if (!selectedDates.startDate || !selectedDates.endDate) return 0
    const days = Math.ceil((selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) / (1000 * 60 * 60 * 24))
    return days * marquee.price
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marqueeId: marquee.id,
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
          ...bookingData,
        }),
      })

      if (response.ok) {
        // Handle success - redirect to confirmation page
        window.location.href = '/booking-confirmation'
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('There was an error creating your booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={bookingData.customer.firstName}
            onChange={(e) => updateBookingData('customer', 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={bookingData.customer.lastName}
            onChange={(e) => updateBookingData('customer', 'lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={bookingData.customer.email}
            onChange={(e) => updateBookingData('customer', 'email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingData.customer.phone}
            onChange={(e) => updateBookingData('customer', 'phone', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          value={bookingData.customer.company}
          onChange={(e) => updateBookingData('customer', 'company', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          value={bookingData.customer.address.street}
          onChange={(e) => updateAddress('street', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={bookingData.customer.address.city}
            onChange={(e) => updateAddress('city', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            value={bookingData.customer.address.postcode}
            onChange={(e) => updateAddress('postcode', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
      
      <div>
        <Label htmlFor="eventType">Event Type *</Label>
        <Select
          value={bookingData.event.type}
          onValueChange={(value) => updateBookingData('event', 'type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="corporate">Corporate Event</SelectItem>
            <SelectItem value="birthday">Birthday Party</SelectItem>
            <SelectItem value="anniversary">Anniversary</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="guestCount">Expected Guest Count *</Label>
        <Input
          id="guestCount"
          type="number"
          min="1"
          max={marquee.capacity}
          value={bookingData.event.guestCount}
          onChange={(e) => updateBookingData('event', 'guestCount', parseInt(e.target.value))}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Maximum capacity: {marquee.capacity} guests
        </p>
      </div>

      <div>
        <Label htmlFor="location">Event Location</Label>
        <Input
          id="location"
          value={bookingData.event.location}
          onChange={(e) => updateBookingData('event', 'location', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="specialRequirements">Special Requirements</Label>
        <Textarea
          id="specialRequirements"
          value={bookingData.event.specialRequirements}
          onChange={(e) => updateBookingData('event', 'specialRequirements', e.target.value)}
          placeholder="Any special requirements or requests..."
          rows={4}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Booking Summary</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Marquee Details</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Marquee:</span> {marquee.name}</div>
          <div><span className="font-medium">Capacity:</span> {marquee.capacity} guests</div>
          <div><span className="font-medium">Price per day:</span> £{marquee.price}</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Selected Dates</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Start Date:</span> {selectedDates.startDate?.toLocaleDateString()}</div>
          <div><span className="font-medium">End Date:</span> {selectedDates.endDate?.toLocaleDateString()}</div>
          <div><span className="font-medium">Duration:</span> {Math.ceil((selectedDates.endDate!.getTime() - selectedDates.startDate!.getTime()) / (1000 * 60 * 60 * 24))} days</div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Daily Rate:</span>
            <span>£{marquee.price}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of Days:</span>
            <span>{Math.ceil((selectedDates.endDate!.getTime() - selectedDates.startDate!.getTime()) / (1000 * 60 * 60 * 24))}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>£{calculateTotalPrice()}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• A deposit of 25% is required to confirm your booking</li>
          <li>• Setup time: {marquee.setupTime} hours before your event</li>
          <li>• Final payment is due 7 days before your event</li>
          <li>• Cancellation policy applies</li>
        </ul>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="text-gray-600"
          >
            ← Back
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Previous
          </Button>
        )}
        
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="ml-auto bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        )}
      </div>
    </div>
  )
} 