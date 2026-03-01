import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import FrontendLayout from '@/layouts/frontend-layout'
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
} from 'react-icons/fa';

const interests = ['Car Wash', 'Deep Clean', 'Auto spa clean', 'Car Repair', 'Other']

export default function Contact() {
    const [selectedInterest, setSelectedInterest] = useState(interests[0])

    return (
        <FrontendLayout>
            <section className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,520px)_1fr] gap-8 rounded-3xl bg-dark-gray px-4 lg:px-10 py-6 lg:py-12 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <article className=" text-white">
                        <p className="text-4xl font-semibold leading-snug tracking-tight">
                            Let’s discuss
                            <br /> on something <span className="text-[#3b82f6]">cool</span>
                            <br /> together
                        </p>
                        <ul className="mt-10 space-y-6 text-sm text-slate-300">
                            {[{
                                icon: <Mail className="h-4 w-4" />, label: 'cardesign@gmail.com', href: 'mailto:cardesign@gmail.com',
                            },
                            { icon: <Phone className="h-4 w-4" />, label: '+123 456 789', href: 'tel:+123456789' },
                            { icon: <MapPin className="h-4 w-4" />, label: '123 Street 456 House' }].map(({ icon, label, href }) => (
                                <li key={label}>
                                    {href ? (
                                        <a href={href} className="flex items-center gap-3 text-slate-200 transition hover:text-white hover:bg-[#0F172A] border-2 border-transparent hover:border-navy rounded-lg">
                                            <span className="inline-flex h-10 w-10 items-center justify-center text-blue-400">
                                                {icon}
                                            </span>
                                            {label}
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2333] text-blue-400">
                                                {icon}
                                            </span>
                                            {label}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-5 flex space-x-4">
                            <a
                                href="https://www.facebook.com/share/p/1ArbKDvNrq/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                            >
                                <FaFacebookF size={20}></FaFacebookF>
                            </a>
                            <a
                                href="https://x.com/glossedbooking?s=21"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                            >
                                <FaTwitter size={20}></FaTwitter>
                            </a>
                            <a
                                href="https://www.instagram.com/glossedbooking?igsh=MXMwM20zbXNodGVzYw%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                            >
                                <FaInstagram size={20}></FaInstagram>
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCdsmPvh1P00ur9N7JgAACDw"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                            >
                                <FaYoutube size={20}></FaYoutube>
                            </a>
                        </div>
                    </article>

                    <form className="rounded-3xl bg-[#eef4ff] px-10 py-12 shadow-inner">
                        <p className="text-sm font-medium text-slate-500">I’m interested in…</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {interests.map((interest) => (
                                <button
                                    type="button"
                                    key={interest}
                                    onClick={() => setSelectedInterest(interest)}
                                    className={`rounded-full border px-5 py-2 text-sm font-medium transition ${selectedInterest === interest
                                            ? 'border-[#2a3f75] bg-[#2a3f75] text-white'
                                            : 'border-[#b3c6f1] text-[#2a3f75]'
                                        }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 space-y-6">
                            {['Your name', 'Your email', 'Your message'].map((placeholder, index) => (
                                <label key={placeholder} className="block text-sm text-slate-600">
                                    <span className="sr-only">{placeholder}</span>
                                    {index === 2 ? (
                                        <textarea
                                            rows={4}
                                            placeholder={placeholder}
                                            className="mt-1 w-full border-0 border-b border-[#40508f] bg-transparent pb-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                                        />
                                    ) : (
                                        <input
                                            placeholder={placeholder}
                                            className="mt-1 w-full border-0 border-b border-[#40508f] bg-transparent pb-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                                        />
                                    )}
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#1f3f95] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1f3f95]/40 transition hover:bg-[#294bb3]"
                        >
                            <Send className="h-4 w-4" />
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </FrontendLayout>
    )
}
