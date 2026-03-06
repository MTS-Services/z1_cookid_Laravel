import { FC, useState, useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, FileUp, ChevronRight, ArrowRight } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { PasswordInput } from '@/components/ui/password-input';
import FileUpload from '@/components/file-upload';

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
        government_issue_license: null as File | null,
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
            <div className="w-full">
                <div className='container flex lg:gap-16'>

                    <div className="bg-bg-gray p-4 md:p-8 overflow-y-auto">
                        <div className="w-full px-4">
                            <h2 className="text-2xl font-semibold text-white mb-1">
                                Welcome to Glossed Marketplace
                            </h2>
                            <p className="text-gray-400 text-md mb-8">
                                Already have an account?{' '}
                                <Link href={route('vendor.auth.login')} className="text-blue-500 hover:underline">
                                    Log in
                                </Link>
                            </p>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name" className="text-xs text-gray-400">
                                            First name*
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                        />
                                        <InputError className="text-[10px]" message={errors.first_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name" className="text-xs text-gray-400">
                                            Last Name*
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                        />
                                        <InputError className="text-[10px]" message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-xs text-gray-400">
                                            Email*
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        <InputError className="text-[10px]" message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone" className="text-xs text-gray-400">
                                            Phone Number*
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                        <InputError className="text-[10px]" message={errors.phone} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="shop_name" className="text-xs text-gray-400">
                                        Enter Your Shop Name*
                                    </Label>
                                    <Input
                                        id="shop_name"
                                        value={data.shop_name}
                                        onChange={e => setData('shop_name', e.target.value)}
                                    />
                                    <InputError className="text-[10px]" message={errors.shop_name} />
                                </div>

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-5 grid gap-2">
                                        <Label htmlFor="region_state" className="text-xs text-gray-400">
                                            Region/State*
                                        </Label>
                                        <Input
                                            id="region_state"
                                            value={data.region_state}
                                            onChange={e => setData('region_state', e.target.value)}
                                        />
                                        <InputError message={errors.region_state} />
                                    </div>
                                    <div className="col-span-4 grid gap-2">
                                        <Label htmlFor="city" className="text-xs text-gray-400">
                                            City*
                                        </Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                    <div className="col-span-3 grid gap-2">
                                        <Label htmlFor="zip_code" className="text-xs text-gray-400">
                                            Zip Code*
                                        </Label>
                                        <Input
                                            id="zip_code"
                                            value={data.zip_code}
                                            onChange={e => setData('zip_code', e.target.value)}
                                        />
                                        <InputError message={errors.zip_code} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address" className="text-xs text-gray-400">
                                        Address*
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    <InputError className="text-[10px]" message={errors.address} />
                                </div>

                                {/* <div>
                                    <label className="text-xs text-gray-400 block mb-1">Government Issue License*</label>
                                    <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center bg-[#1A1A1A] relative hover:border-gray-600 transition">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={e => setData('government_issue_license', e.target.files ? e.target.files[0] : null)}
                                            accept="image/png, image/jpeg"
                                        />
                                        <FileUp className="mx-auto text-navy mb-2" size={32} />
                                        <p className="text-navy text-sm font-medium">Upload License/Certification</p>
                                        <p className="text-gray-500 text-[10px] mt-1">JPEG, PNG files accepted. Max 100MB</p>
                                        {data.government_issue_license && <p className="text-green-500 text-xs mt-2">{data.government_issue_license.name}</p>}
                                        {errors.government_issue_license && <p className="text-red-500 text-[10px] mt-2">{errors.government_issue_license}</p>}
                                    </div>
                                </div> */}

                                <div className="grid gap-2">
                                    <Label htmlFor="government_issue_license" className="text-xs text-gray-400">
                                        Government Issue License*
                                    </Label>
                                    <FileUpload
                                        value={data.government_issue_license}
                                        onChange={(file) =>
                                            setData('government_issue_license', file as File | null)
                                        }
                                        accept="image/png, image/jpeg"
                                        maxSize={10}
                                    />
                                    <InputError className="text-[10px]" message={errors.government_issue_license} />
                                </div>

                                <div className="grid gap-2">
                                    {/* <Label htmlFor="password" className="text-xs text-gray-400">
                                        Password*
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    <InputError className="text-[10px]" message={errors.password} /> */}
                                    <div className="flex justify-between items-center mb-1">
                                        <Label htmlFor="password" className="text-xs text-gray-400">
                                            Password*
                                        </Label>
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 text-xs flex items-center gap-1">
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    <InputError className="text-[10px]" message={errors.password} />

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                        {passwordRequirements.map((req, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-600'}`} />
                                                <span className={`text-xs ${req.met ? 'text-gray-300' : 'text-gray-500'}`}>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" checked={data.terms} onChange={e => setData('terms', e.target.checked)} className="mt-1 accent-navy" id="terms" />
                                    <label htmlFor="terms" className="text-[11px] text-gray-400 leading-relaxed">
                                        I want to receive emails about the product, feature updates, events, and marketing promotions.
                                        <br />
                                        By creating an account, you agree to the <Link href={route('frontend.privacy-policy')} className="text-navy underline">Terms of use</Link> and <Link href={route('frontend.privacy-policy')} className="text-navy underline">Privacy Policy</Link>.
                                    </label>
                                    {errors.terms && <p className="text-red-500 text-[10px] mt-1">{errors.terms}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-navy hover:bg-navy py-3 rounded text-white font-medium transition flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Processing...' : 'Create an account'}
                                    {!processing && <ArrowRight size={18} />}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="hidden lg:block h-full">
                        <img
                            src="/assets/images/vendor/vendor-register.png"
                            alt="Vendor"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default VendorRegisterPage;