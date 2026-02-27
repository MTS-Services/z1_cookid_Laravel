import { FC, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

const VendorRegisterPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        shop_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.auth.register'));
    };

    return (
        <AuthLayout title="Sign Up" description="Become a Vendor">

            <div className="container h-full mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
                    {/* LEFT SIDE - FORM */}
                    <div className="bg-gray-900 border border-gray-800 p-10 shadow-2xl">

                        <h2 className="text-xl font-semibold mb-1">
                            Welcome to Glossed Marketplace
                        </h2>

                        <p className="text-gray-400 text-sm mb-8">
                            Already have an account?{' '}
                            <Link
                                href={route('vendor.auth.login')}
                                className="text-blue-500 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>

                        <form onSubmit={submit} className="space-y-5">

                            {/* First + Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">First Name*</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400">Last Name*</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                </div>
                            </div>

                            {/* Email + Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400">Phone Number*</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Shop Name */}
                            <div>
                                <label className="text-sm text-gray-400">Enter Your Shop Name*</label>
                                <input
                                    type="text"
                                    value={data.shop_name}
                                    onChange={(e) => setData('shop_name', e.target.value)}
                                    className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                />
                                {errors.shop_name && <p className="text-red-500 text-xs mt-1">{errors.shop_name}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-sm text-gray-400">Location*</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm text-gray-400">Password*</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm text-gray-400">Confirm Password*</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full mt-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                                />
                                {errors.password_confirmation &&
                                    <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-medium transition"
                            >
                                {processing ? 'Creating account...' : 'Create an account →'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE - IMAGE */}
                    <div className="hidden md:block">
                        <img
                            src="/assets/images/vendor/vendor-register.png"
                            alt="Vendor"
                            className=" shadow-2xl object-cover w-full h-full  max-h-[800px]"
                        />
                    </div>

            </div>
        </AuthLayout>
    );
};

export default VendorRegisterPage;