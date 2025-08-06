import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Booking Confirmation | Marquee Booking',
    description: 'Your marquee booking has been confirmed. Thank you for choosing our services.',
  }
}

export default function BookingConfirmationPage() {
  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Confirmation Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your booking. We&apos;ve received your request and will be in touch
            shortly to confirm the details and arrange payment.
          </p>

          {/* Next Steps */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive a confirmation email with your booking details within the
                    next hour.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment Arrangement</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll contact you to arrange the 25% deposit payment to secure your
                    booking.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Final Details</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll work with you to finalize setup times and any special requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-yellow-800 mb-3">Important Information</h3>
            <ul className="text-sm text-yellow-700 space-y-2 text-left">
              <li>• Your booking is pending until the deposit is received</li>
              <li>• Final payment is due 7 days before your event</li>
              <li>• Setup will begin 2-6 hours before your event (depending on marquee size)</li>
              <li>• Please ensure your event location is accessible for setup</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Need to make changes?</h3>
            <p className="text-gray-600 mb-4">
              If you need to modify your booking or have any questions, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Phone:</span> 07700 900123
              </p>
              <p>
                <span className="font-medium">Email:</span> bookings@marqueecompany.com
              </p>
              <p>
                <span className="font-medium">Hours:</span> Monday - Friday, 9am - 6pm
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marquees"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse More Marquees
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
