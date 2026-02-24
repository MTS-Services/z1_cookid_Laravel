// src/pages/Dashboard/Notifications.tsx (or wherever fits)
import { FC, useState } from 'react';
import { Bell, Check, ChevronDown, Home, List, ShoppingBag, DollarSign, BarChart2, Settings } from 'lucide-react'; // Icon library

const NotificationsPage: FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock notifications data based on your screenshot
  const notifications = [
    {
      id: 1,
      sender: 'Brian Griffin',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=BG', // Replace with real avatars if available
      message: 'wants to collaborate',
      time: '5 days ago',
      isRead: false,
    },
    {
      id: 2,
      sender: 'Adam',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=A',
      message: "Hey Peter, we've got a new user research opportunity for you. Adam from The Mayor's Office is looking for people like you.",
      time: '1 month ago',
      isRead: true,
    },
    {
      id: 3,
      sender: 'Neil',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=N',
      message: "Hey Peter, we've got a new user research opportunity for you. Neil is looking for people like you.",
      time: '1 month ago',
      isRead: true,
    },
    {
      id: 4,
      sender: 'Quagmire',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=Q',
      message: "Hey Peter, we've got a new user research opportunity for you. Quagmire from Giggitty Co. is looking for people like you.",
      time: '1 month ago',
      isRead: true,
    },
    {
      id: 5,
      sender: 'Herbert',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=H',
      message: "Hey Peter, we've got a new side project opportunity for you. Herbert from Children's Program is looking for people like you.",
      time: '1 month ago',
      isRead: true,
    },
    {
      id: 6,
      sender: 'Cleveland',
      avatar: 'https://via.placeholder.com/40/ffffff/000000?text=C',
      message: "Hey Peter, we've got a new side project opportunity for you. Cleveland from The Post Office is looking for people like you.",
      time: '2 months ago',
      isRead: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-base mx-auto">
            Glossed
          </div>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-black border-b border-gray-800 h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Notifications</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-300 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  B {/* Placeholder for Brayden avatar */}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Brayden</p>
                  <p className="text-xs text-gray-500">Seller</p>
                </div>
                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Logout</a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Notifications List */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Notifications</h2>
              <button className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400">
                <Check size={16} />
                Mark All Read
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border ${notif.isRead ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'
                    } hover:bg-gray-800 transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img src={notif.avatar} alt={notif.sender} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        <span className="text-white">{notif.sender}</span>{' '}
                        {notif.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    {!notif.isRead && (
                      <button className="text-xs text-blue-500 hover:text-blue-400 whitespace-nowrap">
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;