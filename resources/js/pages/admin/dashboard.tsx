import AdminLayout from "@/layouts/admin-layout";
import { Head, usePage } from "@inertiajs/react";
import { Users } from "lucide-react";

type Props = {
  stats: {
    users: number;
    users_last_7_days: number;
  };
  userTypeCounts?: Record<string, { label: string; count: number }>;
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
  <div className={`flex flex-col justify-center gap-2 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900`}>
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <Icon className={`size-5 ${colorClass}`} />
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{subtext}</div>
  </div>
);

export default function Index() {
  const { props } = usePage();
  const { stats = {
    users: 0,
    users_last_7_days: 0
  }, userTypeCounts = {} } = props as unknown as Props;


  return (
    <AdminLayout activeSlug={'dashboard'}>
      <Head title="Admin Dashboard" />
      <div className="flex flex-col gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-1">
          <StatCard
            title="Total Users"
            value={stats.users}
            subtext={`${stats.users_last_7_days} new recently`}
            icon={Users}
            colorClass="text-secondary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
            <div className="space-y-3">
              {Object.entries(userTypeCounts).map(([key, item]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-800">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="px-2 py-1 bg-white rounded border text-xs font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout >
  );
}