import type { Payload } from 'payload'

export const seedCustomers = async (payload: Payload): Promise<void> => {
  // Create sample customers
  const customer1 = await payload.create({
    collection: 'customers',
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '07700 900123',
      company: 'Smith Events Ltd',
      address: {
        street: '123 High Street',
        city: 'London',
        postcode: 'SW1A 1AA',
      },
      notes: 'Regular customer, prefers premium marquees',
      isActive: true,
    },
  })

  const customer2 = await payload.create({
    collection: 'customers',
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '07700 900456',
      address: {
        street: '456 Oak Avenue',
        city: 'Manchester',
        postcode: 'M1 1AA',
      },
      notes: 'Wedding planner, books frequently',
      isActive: true,
    },
  })

  const customer3 = await payload.create({
    collection: 'customers',
    data: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phone: '07700 900789',
      company: 'Brown Corporate Events',
      address: {
        street: '789 Business Park',
        city: 'Birmingham',
        postcode: 'B1 1AA',
      },
      notes: 'Corporate client, prefers luxury marquees',
      isActive: true,
    },
  })

  console.log('✅ Customers seeded successfully')
  console.log('Created customers:', [customer1.id, customer2.id, customer3.id])
}
