import { useEchoNotification } from '@laravel/echo-react';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface BroadcastNotificationPayload {
    sender?: string;
    message?: string;
    avatar_url?: string | null;
}

interface RealtimeNotificationListenerProps {
    channelName: string | null;
}

export function RealtimeNotificationListener({ channelName }: RealtimeNotificationListenerProps) {
    const { listen, leaveChannel } = useEchoNotification<BroadcastNotificationPayload>(
        channelName ?? '',
        (notification) => {
            const message = notification.message ?? 'You have a new notification.';
            const sender = notification.sender ?? 'System';
            toast.info(message, {
                description: sender,
                action: {
                    label: 'View',
                    onClick: () => router.reload(),
                },
            });
            router.reload();
        },
        undefined,
        [channelName],
    );

    useEffect(() => {
        if (!channelName) return;
        listen();
        return () => leaveChannel();
    }, [channelName, listen, leaveChannel]);

    return null;
}
