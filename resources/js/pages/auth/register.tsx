// src/pages/auth/Register.tsx
import { FC, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

const RegisterPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.auth.register'));
    };

    return (
        <AuthLayout title="Register" description="Create your account">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Create your account
                    </h2>

                    <form onSubmit={submit} className="space-y-6">

                        {/* First + Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-xs mt-2">{errors.first_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
                                    required
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-xs mt-2">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
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
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition pr-11"
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

                        {/* Password Confirmation */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#2D60C8] hover:bg-blue-700 disabled:opacity-50 text-white py-3.5 rounded-lg font-medium transition-colors"
                        >
                            {processing ? 'Creating account...' : 'Register →'}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link
                            href={route('user.auth.login')}
                            className="text-blue-500 hover:text-blue-400 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;