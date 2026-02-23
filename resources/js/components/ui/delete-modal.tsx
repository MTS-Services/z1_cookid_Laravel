import { router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'

interface Props {
    href: string
    title?: string
    message?: string
    confirmText?: string
    children: React.ReactNode
    className?: string  
}

export default function DeleteModal({
    href,
    title = "Delete Item",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    children,
    className
}: Props) {
    const [open, setOpen] = React.useState(false) 

    const handleDelete = () => {
        router.delete(href, {
            onSuccess: () => {
                setOpen(false)
                toast.success('Data deleted successfully.')
            },
            onError: () => {
                toast.error('Failed to delete data.')
            }
        })
    }

    return (
        <>
            {/* Trigger button */}
            <button 
                onClick={() => setOpen(true)}
                className={className}
            >
                {children}
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="w-[92%] max-w-sm scale-100 transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                        {/* Top Icon / Header Section */}
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                               <svg 
                                className="h-7 w-7 text-primary" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                {title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                {message}
                            </p>
                        </div>

                        {/* Buttons Section */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-secondary active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}