import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/gmmx_logo_trans.png"
                alt="gmmx logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="font-black text-xl text-white tracking-tight">
                gmmx<span className="text-[#FF5C73]">.app</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The all-in-one management platform for fitness businesses.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mt-2">
              Built for modern fitness business owners across India. Manage members, attendance, payments, coaches, and your business website from one platform.
            </p>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Col */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Free Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools/bmi-calculator" className="hover:text-white transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact Col */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">
                <a href="mailto:gmmxapp@gmail.com" className="hover:text-white transition-colors">gmmxapp@gmail.com</a>
              </li>
              <li className="text-slate-400">
                <a href="https://share.google/rIzmolqvL89QesguI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  1403, Gandhima Nagar Road, Kongu Nagar,<br />
                  Gandhimaa Nagar, Peelamedu,<br />
                  Coimbatore, Tamil Nadu 641004
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-12 p-6 rounded-2xl bg-[#111933] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Start your free trial today</h4>
            <p className="text-sm text-slate-400">Setup takes less than 5 minutes. No credit card required.</p>
          </div>
          <Link href="/signup" className="px-8 py-3.5 bg-white text-slate-900 font-extrabold rounded-xl hover:bg-slate-100 transition-colors shrink-0 shadow-sm">
            Start Free Trial
          </Link>
        </div>

        <hr className="border-white/5 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GMMX. All rights reserved. Made in India 🇮🇳</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/refund" className="hover:text-slate-400">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
