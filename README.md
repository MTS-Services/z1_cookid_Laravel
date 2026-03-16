# Tow Truck Directory (Laravel + React/Inertia)

This is a Laravel-based Tow Truck Directory for Trinidad with a React/Inertia frontend and multi-guard authentication for Admins and Drivers.

For detailed setup of the base project, see `PROJECT_SETUP.md`. This README focuses on a high-level overview and real-time notifications using Laravel Reverb.

---

## Project Overview

- **Backend**: Laravel (multi-guard auth for Admins and Drivers)
- **Frontend**: React + Inertia + Tailwind CSS
- **Database**: MySQL/PostgreSQL (configure in `.env`)
- **Real-time**: Laravel Reverb for broadcasting events/notifications

Key features:

- Admins can approve/remove drivers.
- Drivers have dashboards to manage profile and online/offline status.
- Public directory shows approved/online drivers with WhatsApp contact links.

---

## Quick Start

1. **Install dependencies**

   ```bash
   composer install
   npm install
   ```

2. **Environment & key**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database setup**

   ```bash
   php artisan migrate:fresh --seed
   ```

4. **Run dev servers**

   ```bash
   npm run dev
   php artisan serve
   ```

Default admin user: `admin@towtruck.com` / `password`.

See `PROJECT_SETUP.md` for full route and feature details.

---

## Real-Time Notifications with Laravel Reverb

This project can use **Laravel Reverb** to broadcast real-time notifications (for example, new orders, driver status updates, or admin alerts) to the frontend.

### 1. Enable Reverb

1. Install broadcasting scaffolding (if not already):

   ```bash
   php artisan install:broadcasting
   ```

2. In `.env`, set:

   ```env
   BROADCAST_CONNECTION=reverb

   REVERB_APP_ID=local
   REVERB_APP_KEY=local
   REVERB_APP_SECRET=local
   REVERB_HOST=127.0.0.1
   REVERB_PORT=8080
   REVERB_SCHEME=http

   VITE_REVERB_APP_KEY=${REVERB_APP_KEY}
   VITE_REVERB_HOST=${REVERB_HOST}
   VITE_REVERB_PORT=${REVERB_PORT}
   VITE_REVERB_SCHEME=${REVERB_SCHEME}
   ```

3. Ensure `config/broadcasting.php` has:

   ```php
   'default' => env('BROADCAST_CONNECTION', 'reverb'),
   ```

### 2. Create a Broadcast Notification

1. Generate a notification:

   ```bash
   php artisan make:notification NewOrderNotification
   ```

2. Example notification (simplified) in `app/Notifications/NewOrderNotification.php`:

   ```php
   use Illuminate\Bus\Queueable;
   use Illuminate\Contracts\Queue\ShouldQueue;
   use Illuminate\Notifications\Notification;
   use Illuminate\Notifications\Messages\BroadcastMessage;
   use Illuminate\Broadcasting\PrivateChannel;

   class NewOrderNotification extends Notification implements ShouldQueue
   {
       use Queueable;

       public function __construct(public $order) {}

       public function via($notifiable): array
       {
           return ['database', 'broadcast'];
       }

       public function toBroadcast($notifiable): BroadcastMessage
       {
           return new BroadcastMessage([
               'id'    => $this->order->id,
               'total' => $this->order->total,
               'user'  => $this->order->user->name,
           ]);
       }

       public function broadcastOn(): array
       {
           return [new PrivateChannel('users.'.$this->order->user_id)];
       }
   }
   ```

### 3. Authorize Broadcast Channels

In `routes/channels.php`:

```php
Broadcast::channel('users.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
```

### 4. Trigger the Notification

In a controller or service:

```php
use App\Notifications\NewOrderNotification;

// After creating $order...
$user = $order->user;
$user->notify(new NewOrderNotification($order));
```

### 5. Frontend: Laravel Echo + Reverb

1. Install packages:

   ```bash
   npm install laravel-echo @laravel/reverb
   ```

2. Example `resources/js/bootstrap.ts`:

   ```ts
   import Echo from 'laravel-echo';
   import { ReverbConnector } from '@laravel/reverb';

   // @ts-ignore
   window.Pusher = ReverbConnector;

   declare global {
     interface Window {
       Echo: Echo;
     }
   }

   window.Echo = new Echo({
     broadcaster: 'reverb',
     key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
     wsHost: import.meta.env.VITE_REVERB_HOST ?? '127.0.0.1',
     wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
     enabledTransports: ['ws', 'wss'],
   });
   ```

3. Import this bootstrap file from your main JS/TS entry (e.g. `app.tsx`).

### 6. Listen for Notifications in React

In a React component (e.g. vendor dashboard):

```tsx
useEffect(() => {
  const channel = window.Echo.private(`users.${authUserId}`);

  channel.notification((notification: any) => {
    // Handle new notification
  });

  return () => {
    channel.unsubscribe();
  };
}, [authUserId]);
```

### 7. Run Services

In separate terminals:

```bash
php artisan queue:work       # if notifications are queued
php artisan reverb:start     # start Reverb websocket server
npm run dev                  # frontend dev server
php artisan serve            # Laravel app
```

When an event/notification is fired, the connected browser receives it in real time without page refresh.

