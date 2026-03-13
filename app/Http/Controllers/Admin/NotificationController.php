<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $admin = $request->user('admin');

        $notifications = $admin?->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(function ($notification) {
                $data = $notification->data ?? [];

                return [
                    'id' => (string) $notification->id,
                    'sender' => $data['sender'] ?? 'System',
                    'avatar' => $data['avatar_url'] ?? null,
                    'message' => $data['message'] ?? '',
                    'time' => optional($notification->created_at)?->diffForHumans(),
                    'isRead' => $notification->read_at !== null,
                ];
            })
            ->values();

        return Inertia::render('admin/notification', [
            'notifications' => $notifications,
        ]);
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $admin = $request->user('admin');

        if ($admin) {
            $admin->unreadNotifications()->update([
                'read_at' => now(),
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'All notifications marked as read.');
    }

    public function markAsRead(Request $request, string $notification): RedirectResponse
    {
        $admin = $request->user('admin');

        if ($admin) {
            $notificationModel = $admin->notifications()
                ->where('id', $notification)
                ->first();

            if ($notificationModel && $notificationModel->read_at === null) {
                $notificationModel->forceFill([
                    'read_at' => now(),
                ])->save();
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Notification marked as read.');
    }
}

