import VendorLayout from '@/layouts/vendor-layout'
import { Eye, DollarSign, ShoppingCart, LayoutGrid, Calendar } from 'lucide-react'

const stats = [
    {
        label: 'Active Listings',
        value: '3',
        change: '+12% vs last month',
        icon: LayoutGrid,
    },
    {
        label: 'Total Revenue',
        value: '$1438.00',
        change: '+8% vs last month',
        icon: DollarSign,
    },
    {
        label: 'Pending Orders',
        value: '67',
        change: '-5% vs last month',
        icon: ShoppingCart,
    },
]

const orders = [
    { id: '#ord-001', buyer: 'Arlene McCoy', amount: '$219.78', status: 'Confirmed', delivery: '07/02/2026' },
    { id: '#ord-002', buyer: 'Cody Fisher', amount: '$219.78', status: 'Shipped', delivery: '07/02/2026' },
    { id: '#ord-003', buyer: 'Jacob Jones', amount: '$219.78', status: 'Delivered', delivery: '07/02/2026' },
    { id: '#ord-004', buyer: 'Jenny Wilson', amount: '$219.78', status: 'Confirmed', delivery: '07/02/2026' },
    { id: '#ord-005', buyer: 'Guy Hawkins', amount: '$219.78', status: 'Confirmed', delivery: '07/02/2026' },
    { id: '#ord-006', buyer: 'Robert Fox', amount: '$219.78', status: 'Confirmed', delivery: '07/02/2026' },
]

export default function Dashboard() {
    return (
        <VendorLayout activeSlug="dashboard">
            <div className="space-y-6 text-white bg-[#0F1012] p-6 min-h-screen">

                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-semibold text-blue-500">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">Monitor your customer service performance</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Last 30 days overview</span>
                        <button className="mt-1 flex items-center gap-2 bg-[#1A1C1E] border border-gray-800 px-3 py-1.5 rounded-lg text-xs">
                            <Calendar size={14} className="text-gray-400" />
                            Last 30 days
                            <span className="text-gray-500">▼</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[#1A1C1E] border border-gray-800/50 p-5 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                </div>
                                <div className="bg-[#26292B] p-2 rounded-lg">
                                    <stat.icon size={20} className="text-gray-300" />
                                </div>
                            </div>
                            <p className={`text-[10px] mt-2 ${stat.change.startsWith('+') ? 'text-blue-400' : 'text-red-400'}`}>
                                {stat.change}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Sales Performance Chart Section */}
                <div className="bg-[#1A1C1E] border border-gray-800/50 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-lg font-medium">Sales Performance</h2>
                        <select className="bg-transparent border border-gray-800 text-xs px-3 py-1 rounded-md outline-none">
                            <option>This year</option>
                        </select>
                    </div>

                    <div className="relative h-64 w-full">
                        {/* Tooltip Example */}
                        <div className="absolute left-[28%] top-[15%] z-10">
                            <div className="bg-blue-600 px-3 py-1 rounded text-[10px] font-bold shadow-lg">Jun 2023</div>
                            <div className="bg-[#0F1012] border border-gray-800 px-4 py-1 text-xs font-bold mt-1">$21,500</div>
                            <div className="w-px h-40 bg-gray-700/50 absolute left-1/2 -z-10 mt-1 border-dashed border-l"></div>
                        </div>

                        {/* Chart Area */}
                        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 Q100,20 200,90 T400,60 T600,100 T800,40 T1000,80 L1000,200 L0,200 Z"
                                fill="url(#chartGradient)"
                            />
                            <path
                                d="M0,80 Q100,20 200,90 T400,60 T600,100 T800,40 T1000,80"
                                fill="none" stroke="#3b82f6" strokeWidth="3"
                            />
                        </svg>

                        {/* Months Labels */}
                        <div className="flex justify-between mt-4 px-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                <span key={m} className="text-[10px] text-gray-500">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-[#1A1C1E] border border-gray-800/50 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-medium">Recent Orders</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#141517] text-gray-500 text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-normal">Order ID</th>
                                <th className="px-6 py-4 font-normal">Buyer</th>
                                <th className="px-6 py-4 font-normal">Amount</th>
                                <th className="px-6 py-4 font-normal">Status</th>
                                <th className="px-6 py-4 font-normal">Delivery date</th>
                                <th className="px-6 py-4 font-normal">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-gray-400">{order.id}</td>
                                    <td className="px-6 py-4">{order.buyer}</td>
                                    <td className="px-6 py-4 font-semibold">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] border ${order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' :
                                                order.status === 'Shipped' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' :
                                                    'bg-gray-500/10 border-gray-500/50 text-gray-300'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{order.delivery}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-white"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 flex justify-between items-center bg-[#141517] border-t border-gray-800">
                        <span className="text-xs text-gray-500">Showing 1 to 7 of 7 results</span>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 border border-gray-800 rounded-lg text-xs hover:bg-gray-800">Previous</button>
                            <button className="px-4 py-1.5 border border-gray-800 rounded-lg text-xs hover:bg-gray-800">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    )
}