import { FC, useState, useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, FileUp, ChevronRight } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

const VendorRegisterPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        shop_name: '',
        region_state: '',
        city: '',
        zip_code: '',
        address: '',
        government_id: null as File | null,
        password: '',
        password_confirmation: '',
        terms: false,
    });

    // Password Validation Logic for the UI Checklist
    const passwordRequirements = useMemo(() => [
        { label: 'Use 8 or more characters', met: data.password.length >= 8 },
        { label: 'One Uppercase character', met: /[A-Z]/.test(data.password) },
        { label: 'One lowercase character', met: /[a-z]/.test(data.password) },
        { label: 'One special character', met: /[^A-Za-z0-9]/.test(data.password) },
        { label: 'One number', met: /[0-9]/.test(data.password) },
    ], [data.password]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.auth.register'));
    };

    return (
        <AuthLayout title="Sign Up">
            <div className="flex min-h-screen bg-bg-gray">
                {/* LEFT SIDE - FORM */}
                <div className="container p-8 md:p-16 overflow-y-auto">
                    <div className="w-full px-4">
                        <h2 className="text-2xl font-semibold text-white mb-1">
                            Welcome to Glossed Marketplace
                        </h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Already have an account?{' '}
                            <Link href={route('vendor.auth.login')} className="text-navy hover:underline">
                                Log in
                            </Link>
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Names Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">First name*</label>
                                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                    {errors.first_name && <p className="text-red-500 text-[10px] mt-1">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Last Name*</label>
                                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                    {errors.last_name && <p className="text-red-500 text-[10px] mt-1">{errors.last_name}</p>}
                                </div>
                            </div>

                            {/* Contact Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Phone Number*</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Shop Name */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Enter Your Shop Name*</label>
                                <input type="text" value={data.shop_name} onChange={e => setData('shop_name', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                {errors.shop_name && <p className="text-red-500 text-[10px] mt-1">{errors.shop_name}</p>}
                            </div>

                            {/* Location Grid (Region, City, Zip) */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-5">
                                    <label className="text-xs text-gray-400 block mb-1">Region/State*</label>
                                    <select value={data.region_state} onChange={e => setData('region_state', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-gray-400 focus:border-gray-600 outline-none appearance-none">
                                        <option value="">Select...</option>
                                    </select>
                                    {errors.region_state && <p className="text-red-500 text-[10px] mt-1">{errors.region_state}</p>}
                                </div>
                                <div className="col-span-4">
                                    <label className="text-xs text-gray-400 block mb-1">City*</label>
                                    <select value={data.city} onChange={e => setData('city', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-gray-400 focus:border-gray-600 outline-none appearance-none">
                                        <option value="">Select...</option>
                                    </select>
                                    {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-gray-400 block mb-1">Zip Code*</label>
                                    <input type="text" value={data.zip_code} onChange={e => setData('zip_code', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                    {errors.zip_code && <p className="text-red-500 text-[10px] mt-1">{errors.zip_code}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Address*</label>
                                <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                            </div>

                            {/* Government ID Upload */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Government Issue ID*</label>
                                <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center bg-[#1A1A1A] relative hover:border-gray-600 transition">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setData('government_id', e.target.files ? e.target.files[0] : null)}
                                        accept="image/png, image/jpeg"
                                    />
                                    <FileUp className="mx-auto text-navy mb-2" size={32} />
                                    <p className="text-navy text-sm font-medium">Upload License/Certification</p>
                                    <p className="text-gray-500 text-[10px] mt-1">JPEG, PNG files accepted. Max 100MB</p>
                                    {data.government_id && <p className="text-green-500 text-xs mt-2">{data.government_id.name}</p>}
                                    {errors.government_id && <p className="text-red-500 text-[10px] mt-2">{errors.government_id}</p>}
                                </div>
                            </div>

                            {/* Password Section */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs text-gray-400">Password*</label>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 text-xs flex items-center gap-1">
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-4 py-2.5 text-white focus:border-gray-600 outline-none transition" />
                                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}

                                {/* Live Requirements Checklist */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                    {passwordRequirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-600'}`} />
                                            <span className={`text-[10px] ${req.met ? 'text-gray-300' : 'text-gray-500'}`}>{req.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={data.terms} onChange={e => setData('terms', e.target.checked)} className="mt-1 accent-navy" id="terms" />
                                <label htmlFor="terms" className="text-[11px] text-gray-400 leading-relaxed">
                                    I want to receive emails about the product, feature updates, events, and marketing promotions.
                                    <br />
                                    By creating an account, you agree to the <Link className="text-navy underline">Terms of use</Link> and <Link className="text-navy underline">Privacy Policy</Link>.
                                </label>
                                {errors.terms && <p className="text-red-500 text-[10px] mt-1">{errors.terms}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-navy hover:bg-navy py-3 rounded text-white font-medium transition flex items-center justify-center gap-2"
                            >
                                {processing ? 'Processing...' : 'Create an account'}
                                {!processing && <ChevronRight size={18} />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE - IMAGE */}
                <div className="hidden md:block w-1/2 relative">
                    <img
                        src="/assets/images/vendor/vendor-register.png"
                        alt="Vendor"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </AuthLayout>
    );
};

export default VendorRegisterPage;