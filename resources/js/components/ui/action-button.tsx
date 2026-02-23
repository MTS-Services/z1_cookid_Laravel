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
  variant?: string
  rightIcon?: any

}
function ActionButton({ href, IconNode = Plus, className, children, rightIcon, }: Props) {
  return (
    <>
      <Link href={href || '#'}>
        <Button className={cn('px-4 py-3 h-auto bg-primary hover:bg-secondary', className)}>
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
      </Link>
    </>
  )
}

export { ActionButton }