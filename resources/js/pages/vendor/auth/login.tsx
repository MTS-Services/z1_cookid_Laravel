// src/pages/Login.tsx
import { FC, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

const LoginPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.auth.login'));
    };

    return (
        <AuthLayout title="Login" description="Login to your account">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Login to your account
                    </h2>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                Keep me logged in
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-blue-500 hover:text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3.5 rounded-lg font-medium transition-colors"
                        >
                            {processing ? 'Logging in...' : 'Login →'}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don’t have an account?{' '}
                        <Link
                            href={route('vendor.auth.register')}
                            className="text-blue-500 hover:text-blue-400 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-500">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;