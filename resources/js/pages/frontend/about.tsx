import FrontendLayout from '@/layouts/frontend-layout';
import { Link } from '@inertiajs/react';
import { Dot } from 'lucide-react';
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <FrontendLayout>
      <section className="text-gray-200 pt-20 px-6 md:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white uppercase tracking-wide mb-16">About Us</h1>

          {/* Who We Are - text left, image right with badge */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Who We Are</h2>
              <p className="text-lg leading-relaxed mb-4">
                At Elite Auto Spa, we specialize in premium car detailing and surface protection services designed to restore and maintain your vehicle’s appearance. With years of hands-on experience in automotive care, our mission is simple — deliver showroom-quality results with every service. We combine professional-grade products, advanced techniques, and a passion for perfection to ensure your vehicle looks its absolute best.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our team blends precision, passion, and years of experience to ensure every vehicle looks and feels its absolute best.
              </p>
              <Link href={route('frontend.contact')} className="bg-navy hover:bg-navy-dark text-white font-semibold py-3 px-8 rounded text-base transition transform hover:-translate-y-0.5">Contact Us</Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src="assets/images/about/5d16b0399d052398bcc3f802c3d5bdfbba16265f.jpg"
                  alt="Detailing team"
                  className="w-full h-80 object-cover"
                />
              </div>

              <div className="absolute bottom-0 right-0 bg-white rounded-xl rounded-bl-none rounded-tr-none px-4 py-2 shadow-lg flex flex-col justify-center items-center space-x-3 border-8 border-r-0 border-b-0 border-black">
                <span className="text-4xl text-black tracking-widest">6+</span>
                <span className="text-4xl text-black font-bold">Years</span>
              </div>
            </div>
          </div>

          {/* Our Mission - image left, text right */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div className="">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src="/assets/images/about/Frame 2147225981.png"
                  alt="Workshop cars"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
            <div className="">
              <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-4">Our goal is to provide reliable, high-quality car care services that exceed customer expectations. We believe every vehicle deserves meticulous attention and long-lasting protection.</p>
              <p>We focus on:</p>
              <ul className="space-y-0 text-lg text-gray-200">
                {['Precision detailing', 'Long-term paint protection', 'Customer satisfaction', 'Professional and friendly service'].map((t, i) => (
                  <li key={i} className="flex items-start">
                    <Dot className="text-navy" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Experience */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Our Experience</h2>
              <p className="text-lg leading-relaxed mb-4">With over 6+ years in the auto detailing industry, we've serviced hundreds of vehicles — from daily drivers to luxury and performance cars.</p>
              <ul className="space-y-0 text-lg text-gray-200">
                {['Paint correction', 'Ceramic coating', 'Interior deep cleaning', 'Mobile detailing services'].map((t, i) => (
                  <li key={i} className="flex items-start">
                    <Dot className="text-navy" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 mb-6">
                <img
                  src="assets/images/about/Frame 2147225982.png"
                  alt="Engine bay detailing"
                  className="w-full h-full max-h-80 object-cover"
                />
              </div>
            </div>
          </div>


        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 mb-16">
            <div className="w-full">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 mb-6">
                <img
                  src="assets/images/about/Frame 2147225984.png"
                  alt="Engine bay detailing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Why Choose us</h2>
              <p className="text-lg leading-relaxed mb-4">With over 6+ years in the auto detailing industry, we've serviced hundreds of vehicles — from daily drivers to luxury and performance cars.</p>
              <ul className="space-y-0 text-lg text-gray-200">
                {['Paint correction', 'Ceramic coating', 'Interior deep cleaning', 'Mobile detailing services'].map((t, i) => (
                  <li key={i} className="flex items-start">
                    <Dot className="text-navy" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom - Service Area & Commitment */}
           <div className="grid md:grid-cols-2 gap-8">
             <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-navy mb-4">Service Area</h3>
                <p className="text-lg leading-relaxed mb-4">We proudly serve customers within a 25-mile radius, offering both on-site and mobile detailing services.</p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src="assets/images/about/Frame 2147225985.png"
                  alt="Mobile detailing van"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
             <div>
                 <h3 className="text-2xl font-semibold text-navy mb-4">Our Commitment</h3>
                    <p className="text-lg leading-relaxed mb-6">Your vehicle is an investment — we treat it with care and respect. From a basic wash to full ceramic coating, every detail is handled with precision.</p>
             </div>
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src="assets/images/about/Frame 2147225986.png"
                  alt="Mobile detailing van"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
           </div>
          </div>
      </section>
    </FrontendLayout>
  );
};

export default AboutUs;