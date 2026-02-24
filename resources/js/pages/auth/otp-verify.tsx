import { FC, useRef, useEffect, useState, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

interface OtpVerifyProps {
    email: string;
    expires_at: string; // Passed from Laravel
}

const OtpVerifyPage: FC<OtpVerifyProps> = ({ email, expires_at }) => {
    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    // Logic to calculate remaining seconds from the ISO string
    const getRemainingTime = useCallback(() => {
        if (!expires_at) return 0;
        const expiry = new Date(expires_at).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((expiry - now) / 1000);
        return diff > 0 ? diff : 0;
    }, [expires_at]);

    const [timer, setTimer] = useState(getRemainingTime());

    const { data, setData, post, processing, errors } = useForm({
        email,
        otp: '',
    });

    // Update timer every second
    useEffect(() => {
        setTimer(getRemainingTime()); // Reset timer if expires_at prop changes

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expires_at, getRemainingTime]);

    const handleChange = (value: string, index: number) => {
        const char = value.slice(-1);
        if (!/^\d?$/.test(char)) return;

        const otpArray = data.otp.split('');
        otpArray[index] = char;
        const newOtp = otpArray.join('');
        setData('otp', newOtp);

        if (char && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !data.otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasteData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pasteData)) {
            setData('otp', pasteData);
            inputs.current[5]?.focus();
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.auth.otp.verify'));
    };

    const resendOtp = () => {
        if (timer > 0) return;
        router.post(route('user.auth.otp.resend'), { email });
    };

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AuthLayout title="OTP Verification" description="Verify your login">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl text-center">
                    <h2 className="text-2xl font-semibold mb-3">OTP Verification</h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Enter the code sent to <span className="text-white font-medium">{email}</span>
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="flex justify-center gap-3">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    inputMode="numeric"
                                    ref={(el) => (inputs.current[i] = el)}
                                    value={data.otp[i] || ''}
                                    onPaste={i === 0 ? handlePaste : undefined}
                                    onChange={(e) => handleChange(e.target.value, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    className="w-12 h-14 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            ))}
                        </div>

                        {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp}</p>}

                        <button
                            type="submit"
                            disabled={processing || data.otp.length < 6}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 py-3 rounded-lg font-semibold transition"
                        >
                            {processing ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={resendOtp}
                            disabled={timer > 0 || processing}
                            className="text-sm font-medium text-blue-500 hover:text-blue-400 disabled:text-gray-600 transition"
                        >
                            {timer > 0
                                ? `Resend available in ${formatTime(timer)}`
                                : "Didn't receive code? Resend"}
                        </button>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default OtpVerifyPage;