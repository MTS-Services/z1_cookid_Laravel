import VendorLayout from '@/layouts/vendor-layout';
import React from 'react';

export default function OrderCandelledDetails() {
    const order = {
        id: '#ORD-1',
        reference: '051114075922',
        customer: 'Guy Hawkins',
        serviceProvider: 'Elite Auto Spa',
        serviceTitle: 'Full Interior & Exterior Detailing',
        serviceDescription:
            'Complete exterior hand wash, interior deep cleaning, tire shine, and surface polishing.',
        duration: '2.5 Hours',
        location: 'Customer Address (On-site Service)',
        serviceAmount: '$120',
        serviceDate: 'October 6, 2025',
        completionTime: '2:45 PM',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-78459321',
        cancelBy: 'Vendor',
    };

    return (
        <VendorLayout activeSlug="orders">
            <section className="space-y-6 text-white">
                <div className="rounded-3xl border border-white/5 bg-bg-gray p-6 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
                    <div className="border-b border-white/10 pb-4">
                        <h1 className="text-xl font-semibold">Order Cancel Details</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Order ID: <span className="font-medium text-slate-200">{order.id}-{order.reference}</span>
                        </p>
                    </div>

                    <div className="mt-6 rounded-t-md bg-dark-gray">
                        <div className="border-b border-slate-700 px-5 py-3">
                            <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                                Order Summary
                            </h2>
                        </div>
                        <div className="grid gap-8 border-b border-slate-700 px-5 py-5 md:grid-cols-2">
                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Customer:</span>
                                    <span className="font-medium text-slate-200">{order.customer}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Service Provider:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.serviceProvider}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Service Date:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.serviceDate}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Completion Time:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.completionTime}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Service Amount:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.serviceAmount}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Payment Status:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Payment Method:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">Transaction ID:</span>
                                    <span className="font-medium text-slate-200">
                                        {order.transactionId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-slate-700">
                            <div className="border-b border-slate-700 px-5 py-3">
                                <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                                    Service Details
                                </h2>
                            </div>
                            <div className="space-y-3 px-5 py-4 text-sm text-slate-300">
                                <p className="font-semibold text-sky-400">
                                    {order.serviceTitle}
                                </p>
                                <p>{order.serviceDescription}</p>
                                <div className="mt-2 space-y-1">
                                    <p>
                                        <span className="text-slate-400">Duration: </span>
                                        <span className="font-medium text-slate-200">
                                            {order.duration}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-slate-400">Location: </span>
                                        <span className="font-medium text-slate-200">
                                            {order.location}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-slate-700">
                            <div className="border-b border-slate-700 px-5 py-3">
                                <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                                    Payment Information
                                </h2>
                            </div>
                            <div className="flex flex-col gap-4 px-5 py-4 text-sm text-slate-300 md:flex-row">
                                <div className="flex-1">
                                    <p className="text-slate-400">Payment Method:</p>
                                    <p className="mt-1 font-medium text-sky-400">
                                        {order.paymentMethod}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-400">Payment Date:</p>
                                    <p className="mt-1 font-medium text-sky-400">
                                        {order.serviceDate}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-400">Amount Paid:</p>
                                    <p className="mt-1 font-medium text-sky-400">
                                        {order.serviceAmount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="border-b border-slate-700 px-5 py-3">
                                <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                                    Cancel Information
                                </h2>
                            </div>
                            <div className="px-5 py-4 text-sm text-slate-300">
                                <p>
                                    <span className="text-slate-400">Canceled by: </span>
                                    <span className="font-medium text-slate-200">
                                        {order.cancelBy}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </VendorLayout>
    );
}