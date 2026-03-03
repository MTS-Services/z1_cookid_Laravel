import { useState } from 'react';

import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type RateItem = {
    id: number;
    title: string;
    globalRate: string;
};

const categoryRates: RateItem[] = [
    { id: 1, title: 'WASH', globalRate: '7%' },
    { id: 2, title: 'WASH', globalRate: '7%' },
    { id: 3, title: 'WASH', globalRate: '7%' },
];

const vendorOverrides: RateItem[] = [
    { id: 1, title: 'Auto Clean Spa', globalRate: '7%' },
    { id: 2, title: 'Auto Clean Spa', globalRate: '7%' },
    { id: 3, title: 'Auto Clean Spa', globalRate: '7%' },
];

export default function CommissionPage() {
    const [globalRate, setGlobalRate] = useState('7');

    return (
        <AdminLayout activeSlug="commission">
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
                                        value={globalRate}
                                        onChange={(event) => setGlobalRate(event.target.value)}
                                        className="w-20 h-10"
                                    />
                                    <span className="text-sm text-text-mute-foreground">% (applies on product price)</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="default" size="sm" className="px-4 py-2!">Save</Button>
                    </div>

                    <div className="grid gap-6 pt-4 md:grid-cols-2">
                        <section>
                            <p className="mb-4 text-sm font-medium text-text-mute-foreground">Category Rates</p>
                            <div className="space-y-3">
                                {categoryRates.map((category) => (
                                    <article
                                        key={category.id}
                                        className="flex items-center justify-between rounded-md bg-card-foreground px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white">{category.title}</p>
                                            <p className="text-xs text-text-mute-foreground">Global: {category.globalRate}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                className="w-24 h-8 rounded placeholder:text-xs"
                                                placeholder="Custom%"
                                            />
                                            <Button variant="default" size="sm">
                                                Apply
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section>
                            <p className="mb-4 text-sm font-medium text-text-mute-foreground">Vendor Overrides</p>
                            <div className="space-y-3">
                                {vendorOverrides.map((vendor) => (
                                    <article
                                        key={vendor.id}
                                        className="flex items-center justify-between rounded-md bg-card-foreground px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white">{vendor.title}</p>
                                            <p className="text-xs text-text-mute-foreground">Global: {vendor.globalRate}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                className="w-24 h-8 rounded placeholder:text-xs"
                                                placeholder="Custom%"
                                            />
                                            <Button variant="default" size="sm">
                                                Apply
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
