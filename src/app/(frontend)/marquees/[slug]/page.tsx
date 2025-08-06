import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { MarqueeDetail } from '@/components/MarqueeDetail'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function MarqueeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const marquee = await payload.find({
    collection: 'marquees',
    where: {
      slug: {
        equals: slug,
      },
      isActive: {
        equals: true,
      },
    },
    limit: 1,
  })

  if (!marquee.docs[0]) {
    notFound()
  }

  const marqueeData = marquee.docs[0]

  return (
    <div className="pt-16 pb-24">
      <MarqueeDetail marquee={marqueeData} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const marquee = await payload.find({
    collection: 'marquees',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!marquee.docs[0]) {
    return {
      title: 'Marquee Not Found | Marquee Booking',
    }
  }

  const marqueeData = marquee.docs[0]

  return {
    title: `${marqueeData.name} | Marquee Booking`,
    description: marqueeData.description,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const marquees = await payload.find({
    collection: 'marquees',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 100,
  })

  return marquees.docs.map((marquee) => ({
    slug: marquee.slug,
  }))
}
