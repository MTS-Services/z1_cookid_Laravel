<?php

use App\Notifications\VendorGenericNotification;
use Illuminate\Notifications\Messages\BroadcastMessage;

test('notification is sent via database and broadcast channels', function () {
    $notification = new VendorGenericNotification('System', 'Test message', null);
    $notifiable = new stdClass;

    expect($notification->via($notifiable))->toEqual(['database', 'broadcast']);
});

test('toBroadcast returns BroadcastMessage with notification data', function () {
    $notification = new VendorGenericNotification('Admin', 'Order paid', 'https://example.com/avatar.png');
    $notifiable = new stdClass;

    $message = $notification->toBroadcast($notifiable);

    expect($message)->toBeInstanceOf(BroadcastMessage::class);
    expect($message->data)->toEqual([
        'sender' => 'Admin',
        'avatar_url' => 'https://example.com/avatar.png',
        'message' => 'Order paid',
    ]);
});
