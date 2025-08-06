import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Bookings: CollectionConfig<'bookings'> = {
  slug: 'bookings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: [
      'customer',
      'marquee',
      'startDate',
      'endDate',
      'status',
      'totalPrice',
      'updatedAt',
    ],
    useAsTitle: 'bookingNumber',
  },
  fields: [
    {
      name: 'bookingNumber',
      type: 'text',
      required: true,
      label: 'Booking Number',
      admin: {
        description: 'Auto-generated booking reference',
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: 'Customer',
      admin: {
        position: 'sidebar',
      },
    },
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
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Event Start Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'Event End Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'setupTime',
      type: 'date',
      label: 'Setup Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'teardownTime',
      type: 'date',
      label: 'Teardown Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Booking Status',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      label: 'Payment Status',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Partial',
          value: 'partial',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing Details',
      fields: [
        {
          name: 'dailyRate',
          type: 'number',
          label: 'Daily Rate (£)',
          required: true,
        },
        {
          name: 'numberOfDays',
          type: 'number',
          label: 'Number of Days',
          required: true,
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotal (£)',
          required: true,
        },
        {
          name: 'discount',
          type: 'number',
          label: 'Discount (£)',
          defaultValue: 0,
        },
        {
          name: 'totalPrice',
          type: 'number',
          label: 'Total Price (£)',
          required: true,
        },
      ],
    },
    {
      name: 'payments',
      type: 'group',
      label: 'Payment Details',
      fields: [
        {
          name: 'deposit',
          type: 'number',
          label: 'Deposit Amount (£)',
          defaultValue: 0,
        },
        {
          name: 'depositPaid',
          type: 'checkbox',
          label: 'Deposit Paid',
          defaultValue: false,
        },
        {
          name: 'balance',
          type: 'number',
          label: 'Remaining Balance (£)',
          defaultValue: 0,
        },
        {
          name: 'balancePaid',
          type: 'checkbox',
          label: 'Balance Paid',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'specialRequirements',
      type: 'textarea',
      label: 'Special Requirements',
    },
    {
      name: 'eventDetails',
      type: 'group',
      label: 'Event Details',
      fields: [
        {
          name: 'eventType',
          type: 'text',
          label: 'Event Type',
        },
        {
          name: 'guestCount',
          type: 'number',
          label: 'Expected Guest Count',
          min: 1,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Event Location',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generate booking number for new bookings
        if (operation === 'create' && !data.bookingNumber) {
          const timestamp = Date.now().toString().slice(-6)
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')
          data.bookingNumber = `BK${timestamp}${random}`
        }

        // Calculate pricing
        if (data.dailyRate && data.numberOfDays) {
          const subtotal = data.dailyRate * data.numberOfDays
          const discount = data.discount || 0
          data.totalPrice = subtotal - discount
        }

        // Calculate balance
        if (data.totalPrice && data.deposit) {
          data.balance = data.totalPrice - data.deposit
        }

        // Set created date
        if (operation === 'create') {
          data.createdAt = new Date()
        }

        return data
      },
    ],
  },
}
