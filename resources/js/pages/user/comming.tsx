import { LogOut } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Comming() {
    const logout = () => {
        router.post(route('user.logout'));
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-semibold md:text-6xl">
                Coming Soon...
            </h2>

            <button
                onClick={logout}
                className="mt-5 mb-6 flex cursor-pointer items-center"
            >
                <LogOut className="mr-2" />
                Log out
            </button>
        </div>
    );
}
