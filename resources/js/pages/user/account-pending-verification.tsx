import FrontendLayout from '@/layouts/frontend-layout';
import React from 'react';

const AccountPendingVerification: React.FC = () => {
    return (
        <FrontendLayout>
            <div className="font-sans bg-gradient-to-br from-[#f5f0e8] via-white to-[#f5f0e8] min-h-[calc(100vh-200px] flex items-center justify-center p-6">

                {/* Main Container */}
                <div className="w-full max-w-2xl animate-fade-in">

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

                        {/* Top Accent Bar */}
                        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                        {/* Content */}
                        <div className="p-8 md:p-10 text-center">

                            {/* Animated Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    {/* Pulsing Background Circle */}
                                    <div className="absolute inset-0 bg-secondary/20 rounded-full animate-pulse"></div>

                                    {/* Main Circle */}
                                    <div className="relative bg-gradient-to-br from-primary to-primary/90 w-20 h-20 rounded-full flex items-center justify-center animate-float">
                                        {/* Clock Icon */}
                                        <svg
                                            className="w-10 h-10 text-secondary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 6v6l4 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Heading */}
                            <h1 className="font-bold text-3xl md:text-4xl text-primary mb-4 animate-slide-up">
                                Thank You for Registering!
                            </h1>

                            {/* Main Message */}
                            <div
                                className="bg-[#f5f0e8]/50 rounded-xl p-6 mb-6 border border-secondary/20 animate-slide-up"
                                style={{ animationDelay: '0.1s' }}
                            >
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Your account is currently <span className="font-semibold text-primary">pending approval</span>.
                                    We will notify you once it has been reviewed.
                                </p>
                            </div>

                            {/* Info Cards */}
                            <div
                                className="grid md:grid-cols-2 gap-4 mb-8 animate-slide-up"
                                style={{ animationDelay: '0.2s' }}
                            >

                                {/* Card 1 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-primary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary mb-1">Check Your Email</h3>
                                            <p className="text-sm text-gray-600">You'll receive a confirmation email once your account is approved.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-secondary/10 rounded-full p-2 flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-secondary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary mb-1">Review Process</h3>
                                            <p className="text-sm text-gray-600">Our team typically reviews applications within 24-48 hours.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* What's Next Section */}
                            <div
                                className="bg-gradient-to-br from-primary to-primary/95 rounded-xl p-6 text-white mb-6 animate-slide-up"
                                style={{ animationDelay: '0.3s' }}
                            >
                                <h2 className="font-bold text-xl mb-4">What Happens Next?</h2>
                                <ul className="text-left space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 12l3 3 5-5" />
                                        </svg>
                                        <span>Our team will verify your credentials and application details</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 12l3 3 5-5" />
                                        </svg>
                                        <span>You'll receive an email notification with the approval status</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 12l3 3 5-5" />
                                        </svg>
                                        <span>Once approved, you can access all partner features and benefits</span>
                                    </li>
                                </ul>
                            </div>

                            {/* CTA Buttons */}
                            <div
                                className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-[#b8912a] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl no-underline"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        <path d="M9 22V12h6v10" />
                                    </svg>
                                    Return to Homepage
                                </a>

                                <a
                                    href="mailto:info@whytennessee.com"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-primary font-semibold text-sm px-8 py-3.5 rounded-full border-2 border-primary transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg no-underline"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Support
                                </a>
                            </div>

                            {/* Footer Note */}
                            <p
                                className="text-xs text-gray-500 mt-8 animate-slide-up"
                                style={{ animationDelay: '0.5s' }}
                            >
                                Need help? Contact us at{' '}
                                <a
                                    href="mailto:info@whytennessee.com"
                                    className="text-secondary hover:text-[#b8912a] font-semibold underline"
                                >
                                    info@whytennessee.com
                                </a>
                            </p>

                        </div>
                    </div>

                    {/* Brand Logo/Text
                    <div
                        className="text-center mt-8 animate-fade-in"
                        style={{ animationDelay: '0.6s' }}
                    >
                        <p className="font-bold text-primary text-xl">WhyTennessee</p>
                        <p className="text-gray-600 text-sm mt-1">Your Tennessee Relocation Partner</p>
                    </div> */}

                </div>

                {/* Inline Styles for Animations */}
                <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.7s ease-out;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

            </div>
        </FrontendLayout>
    );
};

export default AccountPendingVerification;