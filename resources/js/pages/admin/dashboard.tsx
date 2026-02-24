import AdminLayout from "@/layouts/admin-layout";
import { Head, usePage } from "@inertiajs/react";
import { Users } from "lucide-react";

type Props = {
  stats: {
    users: number;
    users_last_7_days: number;
  };
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
  } } = props as unknown as Props;


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
      </div>
    </AdminLayout >
  );
}