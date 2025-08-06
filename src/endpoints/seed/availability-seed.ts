import type { Payload } from 'payload'

export const seedAvailability = async (payload: Payload): Promise<void> => {
  // Get all marquees
  const marquees = await payload.find({
    collection: 'marquees',
    limit: 100,
  })

  if (marquees.docs.length === 0) {
    console.log('⚠️ No marquees found. Please seed marquees first.')
    return
  }

  // Create availability for the next 3 months
  const today = new Date()
  const availabilityRecords = []

  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Skip weekends for some marquees (simulate different availability patterns)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    for (const marquee of marquees.docs) {
      // Create availability record for each marquee
      const isAvailable = Math.random() > 0.3 // 70% chance of being available

      // Make weekends more likely to be booked for premium marquees
      const weekendAvailability = marquee.price > 400 ? Math.random() > 0.5 : Math.random() > 0.3
      const finalAvailability = isWeekend ? weekendAvailability : isAvailable

      availabilityRecords.push({
        marquee: marquee.id,
        date: date.toISOString().split('T')[0],
        isAvailable: finalAvailability,
        price: finalAvailability ? marquee.price : null, // Use base price if available
        notes: finalAvailability ? null : 'Booked for private event',
      })
    }
  }

  // Create availability records in batches
  const batchSize = 50
  for (let i = 0; i < availabilityRecords.length; i += batchSize) {
    const batch = availabilityRecords.slice(i, i + batchSize)
    await Promise.all(
      batch.map((record) =>
        payload.create({
          collection: 'availability',
          data: record,
        }),
      ),
    )
  }

  console.log('✅ Availability seeded successfully')
  console.log(`Created ${availabilityRecords.length} availability records`)
}
