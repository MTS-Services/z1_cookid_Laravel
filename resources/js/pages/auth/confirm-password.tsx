import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword({ email }: { email: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <AuthLayout title="Reset Password">
            <Head title="Reset password" />

            <div className="min-w-xs md:w-md rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
                <h2 className="text-2xl font-semibold text-center text-white">
                    Reset Password
                </h2>
                <Form action={route('user.auth.forgot-password-reset.store')} method="post">
                    {({ processing, errors }) => (
                        <div className="mt-8 space-y-6">
                            {/* Hidden email field */}
                            <input type="hidden" name="email" value={email} />

                            {/* Email display */}
                            <div>
                                <Label htmlFor="email-display" className="mb-2 block text-sm text-gray-300">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email-display"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full rounded-lg border border-gray-700 bg-gray-700 px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="mb-2 block text-sm text-gray-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="8+ characters"
                                        autoComplete="new-password"
                                        autoFocus
                                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition focus:border-[#2D60C8] focus:ring-2 focus:ring-[#2D60C8]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="mb-2 block text-sm text-gray-300">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition focus:border-[#2D60C8] focus:ring-2 focus:ring-[#2D60C8]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                className="flex w-full items-center justify-center bg-[#2D60C8] py-3.5 text-sm font-medium text-white hover:bg-navy"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <span className="mr-2 h-4 w-4 animate-spin border-2 border-white/40 border-t-transparent rounded-full" />}
                                Reset Password
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}