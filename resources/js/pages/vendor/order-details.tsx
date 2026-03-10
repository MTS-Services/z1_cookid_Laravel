import VendorLayout from '@/layouts/vendor-layout'
import React from 'react'
import { usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'

import VendorOrderDetailsView, { type VendorOrderDetails } from '@/pages/vendor/components/order-details-view'

type PageProps = InertiaPageProps & {
    order: VendorOrderDetails
    variant?: 'regular' | 'cancelled'
}

export default function OrderDetails() {
    const { order, variant = 'regular' } = usePage<PageProps>().props

    return (
        <VendorLayout activeSlug="orders">
            <VendorOrderDetailsView order={order} variant={variant} />
        </VendorLayout>
    )
}
