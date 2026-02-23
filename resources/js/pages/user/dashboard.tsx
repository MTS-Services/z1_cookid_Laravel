import UserDashboardLayout from '@/layouts/user-dashboard-layout';

export default function Dashboard() {
    return (
        <UserDashboardLayout>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-4">Welcome to your dashboard.</p>
        </UserDashboardLayout>
    );
}
