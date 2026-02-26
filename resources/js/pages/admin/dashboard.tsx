// src/pages/Dashboard/Notifications.tsx (or wherever fits)
import { FC } from 'react';
import VendorLayout from '@/layouts/vendor-layout';
import { Check } from 'lucide-react';

const NotificationsPage: FC = () => {

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
    <VendorLayout activePage="dashboard" subPage="dashboard">
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
    </VendorLayout>
  );
};

export default NotificationsPage;