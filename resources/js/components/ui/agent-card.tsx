import { Link } from '@inertiajs/react';
import { privateEncrypt, publicEncrypt } from 'crypto';
import React from 'react'

type AgentCardProps = {
    data: { [key: string]: any };
};
export default function AgentCard({ data }: AgentCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:shadow-xl">
            <div className="relative h-72 overflow-hidden bg-gray-200">
                <img
                    src={data.image_url}
                    alt={`${data.name} - Property Owner`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Side-Slide Overlay Container */}
                <div className="absolute inset-0 flex items-end justify-center pt-4 bg-black/40 transition-transform duration-500 ease-in-out -translate-x-full group-hover:translate-x-0">
                    {/* The Badge */}
                    <div className="font-medium text-white bg-primary text-center py-4 shadow-lg w-full">
                        Phone: {data.phone}
                    </div>
                </div>
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900">Name: {data.name}</h3>
                <p className="text-sm font-medium text-black mb-4">Email: {data.email}</p>
                <p className="text-sm font-medium leading-relaxed text-gray-600 line-clamp-2">
                    {data.your_self}
                </p>
                <div className="mt-6">
                     <Link href={route('frontend.user-details', { id: data.id })}>
                        <button className="w-full py-3 px-4 border-2 border-gray-800 text-gray-800 font-medium rounded hover:bg-gray-800 hover:text-white transition-colors duration-300 cursor-pointer">
                            Read More
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
