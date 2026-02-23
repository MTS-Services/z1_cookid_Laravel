import React from 'react';
import { Head } from '@inertiajs/react';
import { ShieldCheck, Clock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';
import { ActionButton } from '@/components/ui/action-button';

interface Props {
  user: {
    license_verification_status: 'pending' | 'approved' | 'rejected';
    license_number: string | null;
    updated_at: string;
  };
}

export default function LicenceVerificationStatus({ user }: Props) {
  // Logic based on LicenseVerificationStatus PHP Enum
  const statusConfig = {
    pending: {
      color: 'bg-amber-500',
      icon: <Clock className="text-amber-500" size={32} />,
      label: 'Pending Review',
      description: 'Your license documents are currently being verified by our compliance team. This usually takes 24-48 hours.',
    },
    approved: {
      color: 'bg-green-500',
      icon: <CheckCircle className="text-green-500" size={32} />,
      label: 'Verified',
      description: 'Your professional license has been successfully verified. You now have full access to partner features.',
    },
    rejected: {
      color: 'bg-red-500',
      icon: <AlertCircle className="text-red-500" size={32} />,
      label: 'Rejected',
      description: 'Verification failed due to incorrect information or unclear documents. Please re-submit your details.',
    },
  };

  const currentStatus = statusConfig[user.license_verification_status];

  return (
    <UserDashboardLayout>
      <Head title="Licence Verification Status" />

      <div className="">
        <Card className="border-none shadow-2xl bg-primary text-white overflow-hidden">
          {/* Top Decorative Bar */}
          <div className={`h-2 w-full ${currentStatus.color}`} />

          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Status Icon */}
              <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                {currentStatus.icon}
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <Badge className={`${currentStatus.color} text-white border-none px-4 py-1 text-xs font-bold uppercase tracking-widest`}>
                  {currentStatus.label}
                </Badge>
                <h2 className="text-2xl font-bold pt-2">Licence Verification</h2>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                  {currentStatus.description}
                </p>
              </div>

              {/* Details Table */}
              <div className="w-full mt-4 bg-white/5 rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="flex justify-between p-4">
                  <span className="text-muted text-sm">License Number</span>
                  <span className="text-sm font-mono text-secondary font-bold">
                    {user.license_number || 'Not Provided'}
                  </span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-muted">Last Update</span>
                  <span className="text-sm text-slate-300">
                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Conditional Actions */}
              <div className="w-full pt-4">
                {user.license_verification_status === 'rejected' ? (
                  <Link href={route('user.account-settings')}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6">
                      Update & Re-submit Documents
                    </Button>
                  </Link>
                ) : user.license_verification_status === 'approved' ? (
                  <div className="flex items-center justify-center gap-2 text-green-500 text-xs font-bold uppercase tracking-tighter">
                    <ShieldCheck size={18} /> Verified Partner Account
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    You will receive an email notification once the review is complete.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}