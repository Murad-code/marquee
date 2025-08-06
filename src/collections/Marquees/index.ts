import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Marquees: CollectionConfig<'marquees'> = {
  slug: 'marquees',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'capacity', 'price', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Marquee Name',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      label: 'Capacity (number of people)',
      min: 1,
    },
    {
      name: 'dimensions',
      type: 'group',
      label: 'Dimensions',
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Width (meters)',
          required: true,
        },
        {
          name: 'length',
          type: 'number',
          label: 'Length (meters)',
          required: true,
        },
        {
          name: 'height',
          type: 'number',
          label: 'Height (meters)',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Base Price per Day (£)',
      min: 0,
    },
    {
      name: 'setupTime',
      type: 'number',
      required: true,
      label: 'Setup Time (hours)',
      min: 1,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('name'),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
