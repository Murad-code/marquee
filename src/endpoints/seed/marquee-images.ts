import type { Media } from '@/payload-types'

export const marqueeImage1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Classic 6x6 Marquee - Perfect for intimate gatherings',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Our most popular marquee, perfect for intimate gatherings and small events.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
}

export const marqueeImage2: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Premium 8x12 Marquee - Ideal for medium-sized events',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Spacious marquee ideal for medium-sized events, weddings, and corporate functions.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
}

export const marqueeImage3: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Luxury 10x15 Marquee - Perfect for grand events',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Our largest and most luxurious marquee, perfect for grand events and corporate galas.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
}
