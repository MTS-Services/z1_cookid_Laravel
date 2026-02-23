import FrontendLayout from './frontend-layout';
import Header from './partials/user/header';
import Sidebar from './partials/user/sidebar';

interface UserDashboardLayoutProps {
    children: React.ReactNode;
}
export default function UserDashboardLayout({
    children,
}: UserDashboardLayoutProps) {
    return (
        <div>
            <FrontendLayout>
                <div className="relative h-[400px] w-full items-center justify-center overflow-hidden md:h-[500px]">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute top-0 left-0 h-full w-full object-cover"
                    >
                        <source
                            src="/assets/images/Bristol-Tennesse_-Virginia-aerial-fast-push-over-state-street.mp4"
                            type="video/mp4"
                        />
                    </video>
                    <div className="absolute inset-0 bg-foreground/60"></div>

                    <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center">
                        <div className="text-center text-primary-foreground">
                            <div className="mx-auto max-w-4xl">
                                <h2 className="mb-6 font-montserrat text-3xl leading-tight font-medium sm:text-4xl md:text-5xl">
                                    Account Settings
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container px-4 mx-auto my-20 bg-gray-50 font-sans">
                    <div className="block md:flex gap-10">
                        <Sidebar />

                        <div className="flex w-full flex-col">
                            <Header />
                            <main className="mt-6">{children}</main>
                        </div>
                    </div>
                </div>
            </FrontendLayout>
        </div>
    );
}
