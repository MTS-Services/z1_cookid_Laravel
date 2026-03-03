import { Link } from '@inertiajs/react'
import React from 'react'
import { Button } from './button'
import { Icon } from '../icon'
import { LucideIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
interface Props {
  href?: string
  IconNode?: LucideIcon
  className?: string
  children?: React.ReactNode
  rightIcon?: any
  onClick?: () => void
}

function ActionButton({ href, IconNode = Plus, className, children, rightIcon, onClick }: Props) {
  const content = (
    <Button
      onClick={onClick}
      className={cn(
        'px-4 py-3 h-auto bg-(--color-accent-blue) hover:bg-(--color-accent-blue-dark) cursor-pointer rounded',
        className,
      )}
    >
      {rightIcon ? (
        <>
          {children || 'Create'}
          <Icon iconNode={rightIcon} />
        </>
      ) : (
        <>
          <Icon iconNode={IconNode} />
          {children || 'Create'}
        </>
      )}
    </Button>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export { ActionButton }