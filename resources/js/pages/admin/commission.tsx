import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CommissionRow = {
    id: number;
    category_id: number | null;
    category_name: string;
    commission_type: string;
    commission_type_label: string;
    commission_value: number;
    status: string;
    status_label: string;
    created_at: string | null;
};

type CategoryOption = { id: number; name: string };
type Option = { value: string; label: string };

interface Props {
    commissions: CommissionRow[];
    categories: CategoryOption[];
    commissionTypes: Option[];
    statuses: Option[];
    flash?: { success?: string; error?: string };
}

export default function CommissionPage({
    commissions,
    categories,
    commissionTypes,
    statuses,
    flash = {},
}: Props) {
    const { props } = usePage();
    const pageFlash = (props as { flash?: Props['flash'] }).flash ?? flash;

    const globalCommission = commissions.find((c) => c.category_id === null);
    const globalRate = globalCommission
        ? String(
              globalCommission.commission_type === 'percentage'
                  ? globalCommission.commission_value
                  : globalCommission.commission_value,
          )
        : '7';

    const [globalRateInput, setGlobalRateInput] = useState(globalRate);
    const [savingGlobal, setSavingGlobal] = useState(false);
    const [categoryInputs, setCategoryInputs] = useState<Record<number, string>>({});
    const [applyingId, setApplyingId] = useState<number | null>(null);

    useEffect(() => {
        setGlobalRateInput(globalRate);
    }, [globalRate]);

    const getCommissionForCategory = (categoryId: number) =>
        commissions.find((c) => c.category_id === categoryId);

    const saveGlobal = () => {
        setSavingGlobal(true);
        const value = Number(globalRateInput) || 0;
        const payload = {
            category_id: null,
            commission_type: 'percentage',
            commission_value: value,
            status: 'active',
        };
        if (globalCommission) {
            router.put(route('admin.commission.update', globalCommission.id), payload, {
                preserveScroll: true,
                onFinish: () => setSavingGlobal(false),
            });
        } else {
            router.post(route('admin.commission.store'), payload, {
                preserveScroll: true,
                onFinish: () => setSavingGlobal(false),
            });
        }
    };

    const applyCategory = (categoryId: number, customValue: string) => {
        const value = Number(customValue);
        if (Number.isNaN(value) || value < 0) return;
        setApplyingId(categoryId);
        const existing = getCommissionForCategory(categoryId);
        const payload = {
            category_id: categoryId,
            commission_type: 'percentage',
            commission_value: value,
            status: 'active',
        };
        if (existing) {
            router.put(route('admin.commission.update', existing.id), payload, {
                preserveScroll: true,
                onFinish: () => setApplyingId(null),
            });
        } else {
            router.post(route('admin.commission.store'), payload, {
                preserveScroll: true,
                onFinish: () => setApplyingId(null),
            });
        }
    };

    const globalRateDisplay =
        globalCommission?.commission_type === 'percentage'
            ? `${globalCommission.commission_value}%`
            : `$${Number(globalCommission?.commission_value ?? 0).toFixed(2)}`;

    return (
        <AdminLayout activeSlug="commission">
            <Head title="Commission Settings" />
            <section className="space-y-8 text-white">
                <header>
                    <h1 className="text-2xl font-semibold">Commission Settings</h1>
                </header>

                <div className="rounded-3xl border border-white/5 bg-bg-gray/90 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4 items-center">
                            <p className="text-lg font-medium text-text-mute-foreground">Global Commission Rate</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={globalRateInput}
                                        onChange={(event) => setGlobalRateInput(event.target.value)}
                                        className="w-20 h-10"
                                    />
                                    <span className="text-sm text-text-mute-foreground">
                                        % (applies on product price)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            className="px-4 py-2!"
                            onClick={saveGlobal}
                            disabled={savingGlobal}
                        >
                            {savingGlobal ? 'Saving...' : 'Save'}
                        </Button>
                    </div>

                    <section>
                        <p className="text-md font-medium text-text-mute-foreground">Category Rates</p>
                        <div className="grid gap-6 pt-4 md:grid-cols-2 space-y-3">
                            {categories.map((category) => {
                                const commission = getCommissionForCategory(category.id);
                                const inputValue =
                                    categoryInputs[category.id] ?? (commission ? String(commission.commission_value) : '');
                                return (
                                    <article
                                        key={category.id}
                                        className="flex items-center justify-between rounded-md bg-card-foreground px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white">{category.name}</p>
                                            <p className="text-xs text-text-mute-foreground">
                                                Global: {globalRateDisplay}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                className="w-24 h-8 rounded placeholder:text-xs"
                                                placeholder="Custom%"
                                                value={inputValue}
                                                onChange={(e) =>
                                                    setCategoryInputs((prev) => ({
                                                        ...prev,
                                                        [category.id]: e.target.value,
                                                    }))
                                                }
                                            />
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => applyCategory(category.id, inputValue)}
                                                disabled={applyingId === category.id}
                                            >
                                                {applyingId === category.id ? 'Applying...' : 'Apply'}
                                            </Button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </section>
        </AdminLayout>
    );
}
