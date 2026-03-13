import AdminLayout from '@/layouts/admin-layout'
import { router, usePage } from '@inertiajs/react'
import { Check } from 'lucide-react'

type AdminNotification = {
  id: string
  sender: string
  avatar?: string | null
  message: string
  time?: string | null
  isRead: boolean
}

interface AdminNotificationsPageProps extends Record<string, unknown> {
  notifications: AdminNotification[]
}

export default function NotificationsPage() {
  const { notifications } = usePage<AdminNotificationsPageProps>().props

  const handleMarkAllRead = () => {
    router.post(
      route('admin.notification.mark-all-read'),
      {},
      {
        preserveScroll: true,
      },
    )
  }

  const handleMarkRead = (id: string) => {
    router.post(
      route('admin.notification.read', { notification: id }),
      {},
      {
        preserveScroll: true,
      },
    )
  }

  return (
    <AdminLayout activeSlug="home">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-navy hover:text-blue-400"
          >
            <Check size={16} />
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`rounded-lg border p-4 ${notif.isRead ? 'border-gray-800 bg-gray-900' : 'border-gray-700 bg-gray-800'} hover:bg-gray-800 transition-colors`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                {notif.avatar ? (
                  <img src={notif.avatar} alt={notif.sender} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {notif.sender.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  <span className="text-white">{notif.sender}</span>{' '}
                  {notif.message}
                </p>
                {notif.time && <p className="mt-1 text-sm text-gray-500">{notif.time}</p>}
              </div>
              {!notif.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(notif.id)}
                  className="whitespace-nowrap text-xs text-navy hover:text-blue-400"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900/40 p-8 text-center text-sm text-gray-400">
            You have no notifications yet.
          </div>
        )}
      </div>
    </AdminLayout>
  )
}