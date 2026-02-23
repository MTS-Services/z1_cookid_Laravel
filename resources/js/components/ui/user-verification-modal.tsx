import React from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ShieldIcon } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';

interface Props {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UserVerificationModal({ user, isOpen, onClose }: Props) {
    const { post, processing } = useForm({
        status: '',
    });

    if (!user) return null;

    const handleUpdateStatus = (newStatus: 'approved' | 'rejected') => {
        post(route('admin.um.user.license-verify', { id: user.id, status: newStatus }), {
            onSuccess: () => {
                toast.success('User status updated successfully.'); onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 text-white border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <ShieldIcon className="text-secondary" />
                        License Verification
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Review user documents and update their professional status.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {/* User Basic Info */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <img
                            src={user.image_url || '/no-user-image-icon.png'}
                            className="h-12 w-12 rounded-full object-cover border-2 border-secondary"
                        />
                        <div>
                            <h4 className="font-bold text-lg">{user.name}</h4>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto capitalize text-white">
                            {user.user_type}
                        </Badge>
                    </div>

                    {/* License Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">License Number</p>
                            <p className="text-sm font-mono text-secondary">{user.license_number || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Brokerage</p>
                            <p className="text-sm">{user.brokerage_name || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Current Status Banner */}
                    <div className="flex items-center justify-between p-3 rounded bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
                            <Clock size={16} />
                            Current Status: {user.license_verification_status}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="text-slate-400"
                    >
                        Cancel
                    </Button>

                    <div className="flex gap-2">
                        <Button disabled={processing || user.license_verification_status === 'rejected'}
                            onClick={() => handleUpdateStatus('rejected')}
                            variant="destructive"
                            className="flex gap-2"
                        >
                            <XCircle size={16} /> Reject
                        </Button>
                        <Button disabled={processing || user.license_verification_status === 'approved'}
                            onClick={() => handleUpdateStatus('approved')}
                            className="bg-green-600 hover:bg-green-700 text-white flex gap-2"
                        >
                            <CheckCircle size={16} /> Approve
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}