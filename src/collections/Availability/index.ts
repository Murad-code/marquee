import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Availability: CollectionConfig<'availability'> = {
  slug: 'availability',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['marquee', 'date', 'isAvailable', 'price', 'updatedAt'],
    useAsTitle: 'date',
  },
  fields: [
    {
      name: 'marquee',
      type: 'relationship',
      relationTo: 'marquees',
      required: true,
      label: 'Marquee',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      label: 'Available',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price Override (£)',
      admin: {
        description: 'Leave empty to use marquee base price',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure date is set to start of day
        if (data.date) {
          const date = new Date(data.date)
          date.setHours(0, 0, 0, 0)
          data.date = date
        }
        return data
      },
    ],
  },
}
