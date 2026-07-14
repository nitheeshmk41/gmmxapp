"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Dumbbell, Flower2, Music, Waves, Swords, User, Trophy } from "lucide-react";

const NAV_ITEMS = [
  { 
    label: "Solutions", 
    href: "/solutions/gym",
    megaMenu: true,
    dropdown: [
      { label: "Gym Management", href: "/solutions/gym", icon: Dumbbell, desc: "Members, trainers, attendance, memberships & billing", color: "text-rose-500", bg: "bg-rose-50", badge: "Most Popular", badgeColor: "bg-rose-100 text-rose-600" },
      { label: "Yoga Studio", href: "/solutions/yoga", icon: Flower2, desc: "Class scheduling, instructors, packages & online sessions", color: "text-purple-500", bg: "bg-purple-50", badge: "NEW", badgeColor: "bg-emerald-100 text-emerald-600" },
      { label: "Dance Academy", href: "/solutions/dance", icon: Music, desc: "Student batches, performances, fee management & attendance", color: "text-pink-500", bg: "bg-pink-50" },
      { label: "Swimming Academy", href: "/solutions/swimming", icon: Waves, desc: "Pool schedules, coaches, lane booking & memberships", color: "text-cyan-500", bg: "bg-cyan-50" },
      { label: "Martial Arts", href: "/solutions/martial-arts", icon: Swords, desc: "Belt tracking, competitions, attendance & coach management", color: "text-red-500", bg: "bg-red-50" },
      { label: "Personal Trainer", href: "/solutions/personal-trainer", icon: User, desc: "Client management, workout plans & nutrition coaching", color: "text-orange-500", bg: "bg-orange-50" },
      { label: "Sports Academy", href: "/solutions/sports", icon: Trophy, desc: "Team management, tournaments, schedules & performance tracking", color: "text-amber-500", bg: "bg-amber-50" },
    ]
  },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { 
    label: "Blogs", 
    href: "/blogs",
    dropdown: [
      { label: "All Articles", href: "/blogs" },
      { label: "Fitness Business Tips", href: "/blogs/category/fitness-business-tips" },
      { label: "Coach Guides", href: "/blogs/category/coach-guides" },
      { label: "Member Retention", href: "/blogs/category/member-retention" },
      { label: "Sales & Marketing", href: "/blogs/category/sales-marketing" },
    ]
  },
  { 
    label: "Free Tools", 
    href: "/tools",
    dropdown: [
      { label: "All Tools Hub", href: "/tools" },
      { label: "BMI Calculator", href: "/tools/bmi-calculator" },
      { label: "BMR Calculator", href: "/tools/bmr-calculator" },
      { label: "Body Fat Calculator", href: "/tools/body-fat-calculator" },
      { label: "Calorie Calculator", href: "/tools/calorie-calculator" },
      { label: "Macro Calculator", href: "/tools/macro-calculator" },
      { label: "Protein Calculator", href: "/tools/protein-calculator" },
      { label: "Water Intake Calculator", href: "/tools/water-intake-calculator" },
      { label: "One Rep Max Calculator", href: "/tools/one-rep-max-calculator" },
      { label: "Pace Calculator", href: "/tools/pace-calculator" },
      { label: "Workout Planner", href: "/tools/workout-planner" },
      { label: "Membership Fee Calculator", href: "/tools/membership-fee-calculator" },
      { label: "Business ROI Calculator", href: "/tools/roi-calculator" },
    ]
  },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setMobileMenuOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const getNavStyles = () => {
    if (isHome) {
      return isScrolled
        ? "h-[60px] bg-slate-950/85 backdrop-blur-[12px] border-b border-white/10 shadow-sm"
        : "h-[72px] bg-transparent border-transparent";
    }
    return isScrolled 
      ? "h-[60px] bg-white/80 backdrop-blur-[12px] border-b border-black/5 shadow-sm"
      : "h-[72px] bg-white border-b border-transparent";
  };

  const getLinkStyles = (href: string) => {
    const isActive = pathname === href;
    const baseStyle = "text-sm tracking-wide font-medium px-4 py-2 relative transition-colors";
    const homeStyle = isHome && !isScrolled ? "text-slate-200 hover:text-white" : isHome && isScrolled ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900";
    
    // Underline style
    const activeUnderline = isActive 
      ? `after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-[#FF5C73] after:rounded-full ${isHome ? 'text-white font-semibold' : 'text-slate-900 font-semibold'}`
      : "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-5 after:h-0.5 after:bg-[#FF5C73]/50 after:rounded-full after:transition-all after:duration-300";

    return `${baseStyle} ${homeStyle} ${activeUnderline}`;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavStyles()}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className={`relative transition-all duration-300 ${isScrolled ? "h-6 w-auto" : "h-7 w-auto"}`}>
            <Image
              src="/gmmx_logo_trans.png"
              alt="GMMX"
              width={28}
              height={28}
              className={`h-full w-auto object-contain transition-all duration-300 ${
                isHome && !isScrolled ? "brightness-0 invert" : isHome && isScrolled ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </div>
          <span
            className={`font-black text-xl tracking-tight transition-colors ${
              isHome ? "text-white" : "text-slate-900"
            }`}
          >
            gmmx<span className="text-[#FF5C73]">.app</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            item.dropdown ? (
              <div key={item.href} className="relative group">
                <Link href={item.href} className={getLinkStyles(item.href)}>
                  {item.label}
                </Link>
                <div className={`absolute top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${item.megaMenu ? 'left-1/2 -translate-x-[20%]' : 'left-1/2 -translate-x-1/2'}`}>
                   {item.megaMenu ? (
                     <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[800px] flex flex-col overflow-hidden">
                       <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                         {item.dropdown.map((sub: any) => (
                           <Link key={sub.label} href={sub.href} className="flex items-start gap-4 group/item relative">
                             <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${sub.bg}`}>
                               <sub.icon className={`w-5 h-5 ${sub.color}`} />
                             </div>
                             <div>
                               <div className="flex items-center gap-2">
                                 <h4 className="text-[15px] font-bold text-slate-900 group-hover/item:text-[#FF5C73] transition-colors">{sub.label}</h4>
                                 {sub.badge && (
                                   <span className={`text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${sub.badgeColor || 'bg-slate-100 text-slate-500'}`}>
                                     {sub.badge}
                                   </span>
                                 )}
                               </div>
                               <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">{sub.desc}</p>
                             </div>
                           </Link>
                         ))}
                       </div>
                       
                       {/* Bottom CTA */}
                       <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                         <div>
                           <h4 className="text-sm font-bold text-slate-900">Can&apos;t find your business?</h4>
                           <p className="text-xs text-slate-500 mt-0.5">GMMX works for almost every fitness business. Pilates • Zumba • CrossFit</p>
                         </div>
                         <Link href="/features" className="text-sm font-bold text-[#FF5C73] hover:text-rose-600 flex items-center gap-1 transition-colors">
                           View All Solutions <ArrowRight size={14} />
                         </Link>
                       </div>
                     </div>
                   ) : (
                     <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-56 flex flex-col overflow-hidden">
                       {item.dropdown.map(sub => (
                          <Link key={sub.label} href={sub.href} className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#FF5C73] font-medium transition-colors border-l-2 border-transparent hover:border-[#FF5C73]">
                            {sub.label}
                          </Link>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={getLinkStyles(item.href)}>
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link
            href="/signin"
            className={`text-sm font-semibold transition-colors ${isHome ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "#FF5C73",
              boxShadow: "0 4px 12px rgba(255,92,115,0.2)",
            }}
          >
            Start Free Trial <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className={`absolute top-full left-0 right-0 border-b lg:hidden flex flex-col p-6 gap-4 animate-in slide-in-from-top-5 duration-200 ${
            isHome
              ? "bg-slate-950/95 border-white/10 text-white backdrop-blur-xl"
              : "bg-white/95 border-slate-200 text-slate-900 shadow-xl backdrop-blur-xl"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-semibold tracking-wide py-2 px-4 rounded-xl ${
                  isActive ? "text-[#FF5C73] underline decoration-2 underline-offset-4" : isHome ? "hover:bg-white/5" : "hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <hr className={isHome ? "border-white/10 my-2" : "border-slate-100 my-2"} />
          <div className="flex flex-col gap-3">
            <Link
              href="/signin"
              className={`text-center py-3 rounded-full text-sm font-semibold border ${
                isHome
                  ? "border-white/20 text-white hover:bg-white/5"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 h-11 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: "#FF5C73" }}
            >
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
