import OrderDetailsCard from '@/components/section/orders/order-details-card'
import details from '@/components/section/services/details'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

export default function OrderDetails() {
    return (
        <FrontendLayout>
            <div className="mt-20">
                <OrderDetailsCard
                orderId="ORD-105114075922"
                customerName="Guy Hawkins"
                serviceProvider="Elite Auto Spa"
                serviceDate="October 6, 2025"
                completionTime="2:45 PM"
                serviceAmount="$120"
                paymentStatus="Paid"
                paymentMethod="Credit Card"
                transactionId="TXN-78459321"
                orderStatus="Cancelled"
            />
            </div>
        </FrontendLayout>
    )
}
