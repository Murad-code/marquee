import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Customers: CollectionConfig<'customers'> = {
  slug: 'customers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email', 'phone', 'updatedAt'],
    useAsTitle: 'firstName',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company Name (Optional)',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Address',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
          required: true,
        },
        {
          name: 'postcode',
          type: 'text',
          label: 'Postcode',
          required: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Customer Notes',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active Customer',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure email is lowercase
        if (data.email) {
          data.email = data.email.toLowerCase()
        }
        return data
      },
    ],
  },
}
