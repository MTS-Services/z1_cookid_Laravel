import { type PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/admin-dashboard.css';

// ─── Icon components ──────────────────────────────────────
// Pixel-matched to the design: simple outline icons, 18×18

const IconHome = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
    </svg>
);

const IconVendor = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);

const IconService = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
);

const IconCustomers = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const IconOrders = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const IconFinances = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);

const IconCommission = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
);

const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const IconBell = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const IconChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const IconMenu = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

// ─── Nav definition ───────────────────────────────────────
interface NavItem {
    label: string;
    href: string;
    icon: () => React.JSX.Element;
}

const NAV: NavItem[] = [
    { label: 'Home',               href: '/dashboard',          icon: IconHome },
    { label: 'Vendor Management',  href: '/vendor-management',  icon: IconVendor },
    { label: 'Service Management', href: '/service-management', icon: IconService },
    { label: 'Customers',          href: '/customers',          icon: IconCustomers },
    { label: 'Orders',             href: '/orders',             icon: IconOrders },
    { label: 'Finances',           href: '/finances',           icon: IconFinances },
    { label: 'Comission',          href: '/commission',         icon: IconCommission },
    { label: 'Settings',           href: '/settings',           icon: IconSettings },
];

// ─── Shared props type ────────────────────────────────────
interface SharedProps {
    auth?: { user?: { name?: string; avatar?: string } };
    [key: string]: unknown;
}

// ─── AdminLayout ──────────────────────────────────────────
export default function AdminLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage<SharedProps>();
    const [open, setOpen] = useState(false);

    const user = props.auth?.user;
    const path = url.split('?')[0];

    const active = (href: string) =>
        href === '/dashboard'
            ? path === '/' || path === '/dashboard'
            : path.startsWith(href);

    return (
        <div className="flex h-screen overflow-hidden bg-adm-bg font-open-sans">

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ══════════════════════════════════════
                SIDEBAR  — #1a1a1a, 230 px
            ══════════════════════════════════════ */}
            <aside
                className={[
                    // layout
                    'fixed md:static inset-y-0 left-0 z-50',
                    'flex flex-col w-[230px] min-w-[230px]',
                    // colors
                    'bg-adm-surface',
                    // mobile slide
                    open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    'transition-transform duration-200',
                    // thin right border same as design
                    'border-r border-adm-divider',
                    'adm-scroll overflow-y-auto',
                ].join(' ')}
            >
                {/* Logo — circle with italic "G" + "Glossed" text */}
                <div className="w-full pl-4 md:pl-8 py-2.5 md:py-4 border-b border-adm-divider">
                    <img src="/assets/logo.png" alt="" className='w-12 md:w-16'/>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3">
                    <ul className="space-y-[1px]">
                        {NAV.map((item) => {
                            const Icon = item.icon;
                            const isActive = active(item.href);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={[
                                            // base
                                            'adm-nav-active relative flex items-center gap-3 px-5 py-[10px]',
                                            'text-[13.5px] no-underline transition-colors duration-150',
                                            // active vs idle
                                            isActive
                                                ? 'bg-adm-nav-active-bg text-adm-blue font-semibold'
                                                : 'text-adm-text-sub hover:text-adm-text hover:bg-white/[0.04]',
                                        ].join(' ')}
                                    >
                                        <span className={isActive ? 'text-adm-blue' : 'text-adm-text-sub'}>
                                            <Icon />
                                        </span>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* ══════════════════════════════════════
                MAIN AREA (topbar + content)
            ══════════════════════════════════════ */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* ── Topbar ── same bg as sidebar */}
                <header className="flex items-center justify-end gap-4 md:gap-6 px-6 bg-adm-surface border-b border-adm-divider py-4 xl:h-[96px] shrink-0">

                    {/* Mobile hamburger — push left */}
                    <button
                        className="md:hidden mr-auto flex items-center justify-center w-8 h-8 text-adm-text-sub hover:text-adm-text"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Menu"
                    >
                        <IconMenu />
                    </button>

                    {/* Bell icon */}
                    <button
                        className="flex items-center justify-center w-9 h-9 rounded-full text-adm-text-sub hover:text-adm-text transition-colors"
                        aria-label="Notifications"
                    >
                        <IconBell />
                    </button>

                    {/* User avatar + name + role + chevron */}
                    <div className="flex justify-between items-center gap-4 md:gap-6 md:gap-8 xl:gap-12 cursor-pointer select-none">
                        {/* Avatar — round, 44px, matches design */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 xl:w-14 xl:h-14 rounded-lg overflow-hidden shrink-0 bg-adm-surface-2 ring-1 ring-adm-divider">
                              {user?.avatar ? (
                                  <img src={user.avatar} alt={user.name ?? 'User'} className="w-full h-full object-cover" />
                              ) : (
                                  <div
                                      className="w-full h-full flex items-center justify-center text-white font-bold text-[16px]"
                                      style={{ background: 'linear-gradient(135deg, #5b8ef5 0%, #7c5bf5 100%)' }}
                                  >
                                      {user?.name?.[0]?.toUpperCase() ?? 'A'}
                                  </div>
                              )}
                          </div>

                          {/* Name + role */}
                          <div className="hidden sm:flex flex-col leading-none gap-0.5">
                              <span className="text-adm-text text-[14px] font-semibold">
                                  {user?.name ?? 'Brayden'}
                              </span>
                              <span className="text-adm-text-sub text-[12px]">Admin</span>
                          </div>
                        </div>

                        <span className="text-adm-text-sub">
                            <IconChevronDown />
                        </span>
                    </div>
                </header>

                {/* ── Content ── slightly lighter dark */}
                <main className="flex-1 overflow-y-auto adm-scroll bg-adm-bg">
                    {children}
                </main>
            </div>
        </div>
    );
}