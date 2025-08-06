import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MarqueeCard } from '@/components/MarqueeCard'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface SearchPageProps {
  searchParams: Promise<{
    from?: string
    to?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { from, to } = await searchParams

  if (!from || !to) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Marquees</h1>
          <p className="text-gray-600">Please select dates to search for available marquees.</p>
        </div>
      </div>
    )
  }

  const payload = await getPayload({ config: configPromise })

  // Get all active marquees
  const marqueesResult = await payload.find({
    collection: 'marquees',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const marquees = marqueesResult.docs

  // Get availability data for the selected dates
  const fromDate = new Date(from)
  const toDate = new Date(to)

  // Check availability for each marquee
  const availableMarquees = await Promise.all(
    marquees.map(async (marquee) => {
      const availabilityResult = await payload.find({
        collection: 'availability',
        where: {
          and: [
            {
              marquee: {
                equals: marquee.id,
              },
            },
            {
              date: {
                greater_than_equal: from,
                less_than_equal: to,
              },
            },
          ],
        },
      })

      // Check if all dates in range are available
      const dateRange = []
      const currentDate = new Date(fromDate)
      while (currentDate <= toDate) {
        dateRange.push(currentDate.toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const availabilityRecords = availabilityResult.docs
      const unavailableDates = dateRange.filter((date) => {
        const record = availabilityRecords.find((a) => a.date === date)
        return record && !record.isAvailable
      })

      return {
        marquee,
        isAvailable: unavailableDates.length === 0,
        unavailableDates,
      }
    }),
  )

  const availableMarqueesOnly = availableMarquees.filter((item) => item.isAvailable)

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Marquees</h1>
        <p className="text-lg text-gray-600 mb-2">
          Showing marquees available from {fromDate.toLocaleDateString()} to{' '}
          {toDate.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          {availableMarqueesOnly.length} marquee{availableMarqueesOnly.length !== 1 ? 's' : ''}{' '}
          available for your dates
        </p>
      </div>

      {/* Results */}
      {availableMarqueesOnly.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableMarqueesOnly.map(({ marquee }) => (
            <MarqueeCard key={marquee.id} marquee={marquee} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Marquees Available</h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, no marquees are available for your selected dates.
          </p>
          <p className="text-sm text-gray-500">
            Try selecting different dates or contact us for alternative options.
          </p>
        </div>
      )}

      {/* Alternative Dates Suggestion */}
      {availableMarqueesOnly.length === 0 && (
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking for alternatives?</h3>
          <p className="text-gray-600 mb-6">
            We have many marquees available for other dates. Try searching for different dates or
            contact us for personalized assistance.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search Different Dates
          </a>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Search Available Marquees | Herts Marquee',
    description:
      'Find available marquees for your event dates. Search and book premium marquees for your special occasion.',
  }
}
