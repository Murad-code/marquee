import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'light' | 'dark'
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    variant = 'light',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <div className={clsx('flex items-center', className)}>
      <div
        className={clsx('text-2xl font-bold', variant === 'light' ? 'text-white' : 'text-gray-900')}
      >
        Herts Marquee
      </div>
      <div
        className={clsx('text-sm ml-2', variant === 'light' ? 'text-gray-300' : 'text-gray-600')}
      >
        Elevating Events
      </div>
    </div>
  )
}
