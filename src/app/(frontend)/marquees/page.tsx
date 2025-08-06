import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MarqueeCard } from '@/components/MarqueeCard'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Marquees | Marquee Booking',
    description:
      'Browse our selection of premium marquees for your next event. From intimate gatherings to grand celebrations, we have the perfect marquee for you.',
  }
}

export default async function MarqueesPage() {
  const payload = await getPayload({ config: configPromise })

  const marquees = await payload.find({
    collection: 'marquees',
    where: {
      isActive: {
        equals: true,
      },
    },
    sort: 'price',
    limit: 100,
  })

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Marquees</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we have the perfect marquee for your
            next event. Browse our selection of premium marquees and find the ideal solution for
            your special occasion.
          </p>
        </div>

        {/* Marquee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marquees.docs.map((marquee) => (
            <MarqueeCard key={marquee.id} marquee={marquee} />
          ))}
        </div>

        {marquees.docs.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              No marquees available at the moment
            </h3>
            <p className="text-gray-500">
              Please check back later or contact us for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
