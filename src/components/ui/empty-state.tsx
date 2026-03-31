import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
      {icon && <div className="mb-5 text-gray-300">{icon}</div>}
      <p className="mb-1 text-lg font-semibold text-gray-900">{title}</p>
      {description && (
        <p className="mb-5 text-sm text-gray-500">{description}</p>
      )}
      {action}
    </div>
  )
}
