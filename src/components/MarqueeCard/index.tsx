import type { Marquee } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Link from 'next/link'

interface MarqueeCardProps {
  marquee: Marquee
}

export function MarqueeCard({ marquee }: MarqueeCardProps) {
  const mainImage = marquee.images?.[0]?.image
  const imageUrl =
    mainImage && typeof mainImage === 'object' && 'url' in mainImage
      ? getMediaUrl(mainImage.url)
      : '/placeholder-marquee.jpg'

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={marquee.images?.[0]?.altText || marquee.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Available
        </div>
        {marquee.images && marquee.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {marquee.images.length} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{marquee.name}</h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{marquee.description}</p>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{marquee.capacity}</div>
            <div className="text-sm text-gray-500">Guests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">£{marquee.price}</div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
        </div>

        {/* Dimensions */}
        {marquee.dimensions && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Dimensions:</div>
            <div className="text-sm font-medium">
              {marquee.dimensions.width}m × {marquee.dimensions.length}m ×{' '}
              {marquee.dimensions.height}m
            </div>
          </div>
        )}

        {/* Features */}
        {marquee.features && marquee.features.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Features:</div>
            <div className="flex flex-wrap gap-1">
              {marquee.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {feature.feature}
                </span>
              ))}
              {marquee.features.length > 3 && (
                <span className="text-xs text-gray-500">+{marquee.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Setup Time */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Setup time:</span> {marquee.setupTime} hours
        </div>

        {/* CTA Button */}
        <Link
          href={`/marquees/${marquee.slug}`}
          className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          View Details & Book
        </Link>
      </div>
    </div>
  )
}
