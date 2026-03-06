import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, ChevronLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Forgot password">
            <Head title="Forgot password" />

            <div className="mx-auto w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
                <h2 className="text-2xl font-semibold text-center text-white">
                    Forget Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Enter the email address or mobile phone number associated with your Clicon account.
                </p>

                {status && (
                    <div className="mt-6 rounded-lg bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400">
                        {status}
                    </div>
                )}

                <Form action={route('user.auth.forgot-password.otp-verify')} method="post" className="mt-8 space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoFocus
                                    placeholder="name@company.com"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition focus:border-[#2D60C8] focus:ring-2 focus:ring-[#2D60C8]/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="flex w-full items-center justify-center bg-[#2D60C8] py-3.5 text-sm font-medium text-white hover:bg-navy"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Send Code
                            </Button>

                            <div className="mt-4 border-t border-gray-800 pt-4 text-xs text-gray-500">
                                You may contact{' '}
                                <a href="#" className="text-[#2D60C8] hover:text-blue-400 hover:underline">
                                    Customer Service
                                </a>{' '}
                                for help restoring access to your account.
                            </div>

                            <Link
                                href={route('user.auth.login')}
                                className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to log in
                            </Link>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}