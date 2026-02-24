// src/pages/Login.tsx
import { FC, useState } from 'react';
import { Eye, EyeOff, Heart, User } from 'lucide-react'; // or your icon library

const RegisterPage: FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans">
            {/* Top Bar / Navbar */}
            <header className="bg-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-base">
                            Glossed
                        </div>
                        <p className="text-gray-400 text-sm">
                            Welcome to Glossed eCommerce store.
                        </p>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Home
                        </a>
                        <a href="/service" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Service
                        </a>
                        <a href="/categories" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Categories
                        </a>
                        <a href="/how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">
                            How It Works
                        </a>
                    </nav>

                    <div className="flex items-center gap-5">
                        <button className="text-gray-300 hover:text-white">
                            <Heart size={20} />
                        </button>
                        <button className="text-gray-300 hover:text-white">
                            <User size={20} />
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors">
                            Become a Provider
                        </button>
                    </div>
                </div>
            </header>
            {/* Main Login Section */}
            <main className="flex items-center justify-center min-h-[calc(100vh-140px)] px-5 py-12">
                <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-semibold text-center mb-8">Login to your account</h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
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
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-300 select-none">
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                                Keep me logged in
                            </label>
                            <a href="/forgot-password" className="text-blue-500 hover:text-blue-400 hover:underline">
                                Forgot password ?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-medium transition-colors"
                        >
                            Login →
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-500 hover:text-blue-400 hover:underline">
                            Sign in
                        </a>
                    </p>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors">
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black border-t border-gray-800 py-6 text-center text-sm text-gray-600">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
                        Glossed
                    </div>
                    <p>all right reserved ©2026 Glossed</p>
                    <a href="/privacy" className="text-blue-500 hover:text-blue-400 hover:underline">
                        Privacy policies
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default RegisterPage;