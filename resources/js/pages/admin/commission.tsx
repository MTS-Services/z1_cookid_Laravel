import { useState } from 'react'

import AdminLayout from '@/layouts/admin-layout'

type RateItem = {
  id: number
  title: string
  globalRate: string
  subtitle: string
}

const categoryRates: RateItem[] = [
  { id: 1, title: 'Wash', globalRate: '7%', subtitle: 'Applies to detailing & wash services' },
  { id: 2, title: 'Detailing', globalRate: '7%', subtitle: 'Covers premium add-ons' },
  { id: 3, title: 'Interior', globalRate: '7%', subtitle: 'Seats, console & upholstery' },
]

const vendorOverrides: RateItem[] = [
  { id: 1, title: 'Auto Clean Spa', globalRate: '7%', subtitle: 'Downtown Nashville' },
  { id: 2, title: 'Shine & Drive', globalRate: '7%', subtitle: 'Mobile unit #12' },
  { id: 3, title: 'Pure Wash Co.', globalRate: '7%', subtitle: 'Brentwood location' },
]

export default function CommissionPage() {
  const [globalRate, setGlobalRate] = useState('7')
  const [categoryCustom, setCategoryCustom] = useState<Record<number, string>>({})
  const [vendorCustom, setVendorCustom] = useState<Record<number, string>>({})

  const handleCategoryInput = (id: number, value: string) => {
    setCategoryCustom((prev) => ({ ...prev, [id]: value }))
  }

  const handleVendorInput = (id: number, value: string) => {
    setVendorCustom((prev) => ({ ...prev, [id]: value }))
  }

  const handleApply = (scope: 'category' | 'vendor', id: number) => {
    const value = scope === 'category' ? categoryCustom[id] : vendorCustom[id]
    console.log(`Apply ${scope} override`, { id, value })
  }

  return (
    <AdminLayout activeSlug="commission">
      <section className="space-y-8 text-white">
        <header>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-text-gray">Controls</p>
          <h1 className="mt-2 text-3xl font-semibold">Commission Settings</h1>
          <p className="mt-1 text-text-gray">Fine-tune global earnings and apply overrides per category or vendor.</p>
        </header>

        <div className="rounded-3xl border border-white/5 bg-bg-gray/90 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="grid gap-4 pb-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-gray">Global Commission Rate</p>
              <div className="mt-4 flex flex-col gap-3 text-white sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <input
                    value={globalRate}
                    onChange={(event) => setGlobalRate(event.target.value)}
                    className="w-24 rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-center text-lg font-semibold focus:border-white/40 focus:outline-none"
                  />
                  <span className="text-text-gray">% (applies on product price)</span>
                </div>
                <button className="ml-auto inline-flex items-center justify-center rounded-2xl bg-[#3478FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4a88ff]">
                  Save
                </button>
              </div>
            </div>
            <div className="hidden text-right text-sm text-text-gray lg:block">
              Last updated <span className="text-white">5 mins ago</span>
            </div>
          </div>

          <div className="grid gap-6 pt-6 lg:grid-cols-2">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-text-gray">Category Rates</p>
                  <h2 className="text-xl font-semibold">Global vs Custom</h2>
                </div>
                <span className="text-sm text-text-gray">Global: {globalRate}%</span>
              </div>
              <div className="space-y-4">
                {categoryRates.map((category) => (
                  <article
                    key={category.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#1F1F1F] p-4 shadow-inner shadow-black/30 md:flex-row md:items-center md:gap-6"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wide text-white">{category.title}</p>
                      <p className="text-xs text-text-gray">Global: {category.globalRate}</p>
                      <p className="mt-1 text-xs text-text-gray-50">{category.subtitle}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                      <input
                        placeholder="Custom %"
                        value={categoryCustom[category.id] ?? ''}
                        onChange={(event) => handleCategoryInput(category.id, event.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-[#2B2B2B] px-4 py-3 text-sm text-white placeholder:text-text-gray focus:border-white/30 focus:outline-none"
                      />
                      <button
                        onClick={() => handleApply('category', category.id)}
                        className="rounded-2xl bg-[#4A90E2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5ba2ff]"
                      >
                        Apply
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-text-gray">Vendor Overrides</p>
                  <h2 className="text-xl font-semibold">Per vendor customization</h2>
                </div>
                <span className="text-sm text-text-gray">Global: {globalRate}%</span>
              </div>
              <div className="space-y-4">
                {vendorOverrides.map((vendor) => (
                  <article
                    key={vendor.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#1F1F1F] p-4 shadow-inner shadow-black/30 md:flex-row md:items-center md:gap-6"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{vendor.title}</p>
                      <p className="text-xs text-text-gray">Global: {vendor.globalRate}</p>
                      <p className="mt-1 text-xs text-text-gray-50">{vendor.subtitle}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                      <input
                        placeholder="Custom %"
                        value={vendorCustom[vendor.id] ?? ''}
                        onChange={(event) => handleVendorInput(vendor.id, event.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-[#2B2B2B] px-4 py-3 text-sm text-white placeholder:text-text-gray focus:border-white/30 focus:outline-none"
                      />
                      <button
                        onClick={() => handleApply('vendor', vendor.id)}
                        className="rounded-2xl bg-[#4A90E2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5ba2ff]"
                      >
                        Apply
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
