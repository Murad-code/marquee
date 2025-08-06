import type { Payload, File } from 'payload'
import { marqueeImage1, marqueeImage2, marqueeImage3 } from './marquee-images'

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}

export const seedMarquees = async (payload: Payload): Promise<void> => {
  // Create marquee images first
  const [image1Buffer, image2Buffer, image3Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
  ])

  const [marqueeImage1Doc, marqueeImage2Doc, marqueeImage3Doc] = await Promise.all([
    payload.create({
      collection: 'media',
      data: marqueeImage1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: marqueeImage2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: marqueeImage3,
      file: image3Buffer,
    }),
  ])

  // Create sample marquees
  const marquee1 = await payload.create({
    collection: 'marquees',
    data: {
      name: 'Classic 6x6 Marquee',
      description:
        'Our most popular marquee, perfect for intimate gatherings and small events. Features a traditional white canopy with clear sides for all-weather protection.',
      capacity: 50,
      dimensions: {
        width: 6,
        length: 6,
        height: 3,
      },
      price: 250,
      setupTime: 2,
      images: [
        {
          image: marqueeImage1Doc.id,
          altText: 'Classic 6x6 Marquee exterior view',
        },
        {
          image: marqueeImage1Doc.id,
          altText: 'Classic 6x6 Marquee interior setup',
        },
      ],
      features: [
        { feature: 'White canopy' },
        { feature: 'Clear side panels' },
        { feature: 'LED lighting' },
        { feature: 'Ground anchors' },
      ],
      isActive: true,
    },
  })

  const marquee2 = await payload.create({
    collection: 'marquees',
    data: {
      name: 'Premium 8x12 Marquee',
      description:
        'Spacious marquee ideal for medium-sized events, weddings, and corporate functions. Includes premium flooring and climate control options.',
      capacity: 120,
      dimensions: {
        width: 8,
        length: 12,
        height: 3.5,
      },
      price: 450,
      setupTime: 4,
      images: [
        {
          image: marqueeImage2Doc.id,
          altText: 'Premium 8x12 Marquee exterior view',
        },
        {
          image: marqueeImage2Doc.id,
          altText: 'Premium 8x12 Marquee interior setup',
        },
      ],
      features: [
        { feature: 'Premium white canopy' },
        { feature: 'Clear side panels' },
        { feature: 'LED lighting system' },
        { feature: 'Heating available' },
        { feature: 'Premium flooring' },
        { feature: 'Power supply' },
      ],
      isActive: true,
    },
  })

  const marquee3 = await payload.create({
    collection: 'marquees',
    data: {
      name: 'Luxury 10x15 Marquee',
      description:
        'Our largest and most luxurious marquee, perfect for grand events, large weddings, and corporate galas. Features premium amenities and full climate control.',
      capacity: 200,
      dimensions: {
        width: 10,
        length: 15,
        height: 4,
      },
      price: 750,
      setupTime: 6,
      images: [
        {
          image: marqueeImage3Doc.id,
          altText: 'Luxury 10x15 Marquee exterior view',
        },
        {
          image: marqueeImage3Doc.id,
          altText: 'Luxury 10x15 Marquee interior setup',
        },
      ],
      features: [
        { feature: 'Luxury white canopy' },
        { feature: 'Clear side panels' },
        { feature: 'Advanced LED lighting' },
        { feature: 'Full climate control' },
        { feature: 'Premium flooring' },
        { feature: 'Power supply' },
        { feature: 'Sound system available' },
        { feature: 'Bar area setup' },
      ],
      isActive: true,
    },
  })

  console.log('✅ Marquees seeded successfully')
  console.log('Created marquees:', [marquee1.id, marquee2.id, marquee3.id])
}
