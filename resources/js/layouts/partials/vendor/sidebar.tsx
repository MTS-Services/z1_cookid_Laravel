import { BarChart2, DollarSign, Home, List, Settings, ShoppingBag } from 'lucide-react'
import React from 'react'

export default function VendorSidebar() {
    return (
        <aside className="w-64 bg-black border-r border-gray-800 flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <img src="/images/logo/logo.png" alt="logo" className="w-10 h-10" />
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white font-medium"
                >
                    <Home size={20} />
                    Home
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <List size={20} />
                    Listing
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <ShoppingBag size={20} />
                    Orders
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <DollarSign size={20} />
                    Payments
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <BarChart2 size={20} />
                    Performance
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <Settings size={20} />
                    Accounts
                </a>
            </nav>
        </aside>
    )
}
