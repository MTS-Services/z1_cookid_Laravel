import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export default function Comming() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-semibold md:text-6xl">Coming Soon...</h2>

            <Link
                className="mb-6 flex cursor-pointer items-center mt-5"
                href="/admin/logout"
                method="post"
                as="button"
                data-test="logout-button"
            >
                <LogOut className="mr-2" />
                Log out
            </Link>
        </div>
    );
}
