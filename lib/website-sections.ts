import { WebsiteSectionDefinition } from "@/types";

export const WEBSITE_SECTIONS: WebsiteSectionDefinition[] = [
  // ─────────────────────────────────────────────
  // 1. Navigation / Header (often hardcoded or mandatory, but listed)
  // ─────────────────────────────────────────────
  {
    key: "navigation",
    label: "Navigation",
    category: "mandatory",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Menu",
  },
  // ─────────────────────────────────────────────
  // 2. Hero Section
  // ─────────────────────────────────────────────
  {
    key: "hero",
    label: "Hero Section",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: { title: "Welcome to GMMX", subtitle: "Your fitness journey starts here" },
    icon: "Image",
  },
  // ─────────────────────────────────────────────
  // 3. Trusted By
  // ─────────────────────────────────────────────
  {
    key: "trusted_by",
    label: "Trusted By (Brands)",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "ShieldCheck",
  },
  // ─────────────────────────────────────────────
  // 4. About Us
  // ─────────────────────────────────────────────
  {
    key: "about",
    label: "About Us",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Info",
  },
  // ─────────────────────────────────────────────
  // 5. Facility Overview
  // ─────────────────────────────────────────────
  {
    key: "facility",
    label: "Facility Overview",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Building",
  },
  // ─────────────────────────────────────────────
  // 6. Programs / Services
  // ─────────────────────────────────────────────
  {
    key: "programs",
    label: "Programs & Services",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Dumbbell",
  },
  // ─────────────────────────────────────────────
  // 7. Membership Plans
  // ─────────────────────────────────────────────
  {
    key: "plans",
    label: "Membership Plans",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "CreditCard",
  },
  // ─────────────────────────────────────────────
  // 8. Pricing Comparison
  // ─────────────────────────────────────────────
  {
    key: "pricing_comparison",
    label: "Pricing Comparison",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Table",
  },
  // ─────────────────────────────────────────────
  // 9. Personal Trainers
  // ─────────────────────────────────────────────
  {
    key: "trainers",
    label: "Personal Trainers",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Users",
  },
  // ─────────────────────────────────────────────
  // 10. Success Stories
  // ─────────────────────────────────────────────
  {
    key: "success_stories",
    label: "Success Stories",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Star",
  },
  // ─────────────────────────────────────────────
  // 11. Testimonials
  // ─────────────────────────────────────────────
  {
    key: "testimonials",
    label: "Testimonials",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "MessageSquare",
  },
  // ─────────────────────────────────────────────
  // 12. Statistics
  // ─────────────────────────────────────────────
  {
    key: "stats",
    label: "Statistics & Counters",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "BarChart",
  },
  // ─────────────────────────────────────────────
  // 13. Gallery
  // ─────────────────────────────────────────────
  {
    key: "gallery",
    label: "Gallery",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Image",
  },
  // ─────────────────────────────────────────────
  // 14. Virtual Tour
  // ─────────────────────────────────────────────
  {
    key: "virtual_tour",
    label: "Virtual Tour (360°)",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Video",
  },
  // ─────────────────────────────────────────────
  // 15. Equipment Showcase
  // ─────────────────────────────────────────────
  {
    key: "equipment",
    label: "Equipment Showcase",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Dumbbell",
  },
  // ─────────────────────────────────────────────
  // 16. Timetable
  // ─────────────────────────────────────────────
  {
    key: "timetable",
    label: "Class Schedule / Timetable",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Calendar",
  },
  // ─────────────────────────────────────────────
  // 17. Book Trial
  // ─────────────────────────────────────────────
  {
    key: "book_trial",
    label: "Book a Free Trial",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "CalendarPlus",
  },
  // ─────────────────────────────────────────────
  // 18. Book Consultation
  // ─────────────────────────────────────────────
  {
    key: "book_consultation",
    label: "Book Consultation",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "UserPlus",
  },
  // ─────────────────────────────────────────────
  // 19. BMI Calculator
  // ─────────────────────────────────────────────
  {
    key: "calculator_bmi",
    label: "BMI Calculator",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Activity",
  },
  // ─────────────────────────────────────────────
  // 20. Calorie Calculator
  // ─────────────────────────────────────────────
  {
    key: "calculator_calorie",
    label: "Calorie Calculator",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Calculator",
  },
  // ─────────────────────────────────────────────
  // 21. Body Fat Calculator
  // ─────────────────────────────────────────────
  {
    key: "calculator_bodyfat",
    label: "Body Fat Calculator",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Activity",
  },
  // ─────────────────────────────────────────────
  // 22. Fitness Goal Quiz
  // ─────────────────────────────────────────────
  {
    key: "quiz",
    label: "Fitness Goal Quiz",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "HelpCircle",
  },
  // ─────────────────────────────────────────────
  // 23. Attendance Preview
  // ─────────────────────────────────────────────
  {
    key: "attendance_preview",
    label: "Attendance Preview",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "CheckCircle",
  },
  // ─────────────────────────────────────────────
  // 24. Mobile App Promotion
  // ─────────────────────────────────────────────
  {
    key: "mobile_app",
    label: "Mobile App Promotion",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Smartphone",
  },
  // ─────────────────────────────────────────────
  // 25. Referral Program
  // ─────────────────────────────────────────────
  {
    key: "referral",
    label: "Referral Program",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Gift",
  },
  // ─────────────────────────────────────────────
  // 26. Offers
  // ─────────────────────────────────────────────
  {
    key: "offers",
    label: "Special Offers",
    category: "essential",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Tag",
  },
  // ─────────────────────────────────────────────
  // 27. Corporate Membership
  // ─────────────────────────────────────────────
  {
    key: "corporate",
    label: "Corporate Membership",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Briefcase",
  },
  // ─────────────────────────────────────────────
  // 28. Nutrition Plans
  // ─────────────────────────────────────────────
  {
    key: "nutrition",
    label: "Nutrition Plans",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Heart",
  },
  // ─────────────────────────────────────────────
  // 29. Supplements
  // ─────────────────────────────────────────────
  {
    key: "supplements",
    label: "Supplements Store",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "ShoppingCart",
  },
  // ─────────────────────────────────────────────
  // 30. Merchandise
  // ─────────────────────────────────────────────
  {
    key: "merchandise",
    label: "Gym Merchandise",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "ShoppingBag",
  },
  // ─────────────────────────────────────────────
  // 31. Events
  // ─────────────────────────────────────────────
  {
    key: "events",
    label: "Events & Workshops",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "CalendarEvent",
  },
  // ─────────────────────────────────────────────
  // 32. Blog
  // ─────────────────────────────────────────────
  {
    key: "blog",
    label: "Blog & Articles",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "BookOpen",
  },
  // ─────────────────────────────────────────────
  // 33. FAQ
  // ─────────────────────────────────────────────
  {
    key: "faq",
    label: "Frequently Asked Questions",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "HelpCircle",
  },
  // ─────────────────────────────────────────────
  // 34. Contact & Map
  // ─────────────────────────────────────────────
  {
    key: "contact",
    label: "Contact Information",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "MapPin",
  },
  // ─────────────────────────────────────────────
  // 35. Google Maps
  // ─────────────────────────────────────────────
  {
    key: "google_maps",
    label: "Google Maps Embed",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Map",
  },
  // ─────────────────────────────────────────────
  // 36. Operating Hours
  // ─────────────────────────────────────────────
  {
    key: "operating_hours",
    label: "Operating Hours",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Clock",
  },
  // ─────────────────────────────────────────────
  // 37. Social Media
  // ─────────────────────────────────────────────
  {
    key: "social_media",
    label: "Social Media Feed",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Instagram",
  },
  // ─────────────────────────────────────────────
  // 38. Newsletter
  // ─────────────────────────────────────────────
  {
    key: "newsletter",
    label: "Newsletter Subscription",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Mail",
  },
  // ─────────────────────────────────────────────
  // 39. Live Chat
  // ─────────────────────────────────────────────
  {
    key: "live_chat",
    label: "Live Chat / Chatbot",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "MessageCircle",
  },
  // ─────────────────────────────────────────────
  // 40. Lead Capture Popup
  // ─────────────────────────────────────────────
  {
    key: "popup_lead",
    label: "Lead Capture Popup",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Maximize",
  },
  // ─────────────────────────────────────────────
  // 41. Floating Buttons
  // ─────────────────────────────────────────────
  {
    key: "floating_buttons",
    label: "Floating Actions (Call/WhatsApp)",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Phone",
  },
  // ─────────────────────────────────────────────
  // 42. Sticky CTA
  // ─────────────────────────────────────────────
  {
    key: "sticky_cta",
    label: "Sticky CTA Banner",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Navigation",
  },
  // ─────────────────────────────────────────────
  // 43. Transformation Challenge
  // ─────────────────────────────────────────────
  {
    key: "challenge",
    label: "Transformation Challenge",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Target",
  },
  // ─────────────────────────────────────────────
  // 44. Achievements
  // ─────────────────────────────────────────────
  {
    key: "achievements",
    label: "Achievements & Awards",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Award",
  },
  // ─────────────────────────────────────────────
  // 45. Community
  // ─────────────────────────────────────────────
  {
    key: "community",
    label: "Community / Group",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Users",
  },
  // ─────────────────────────────────────────────
  // 46. Careers
  // ─────────────────────────────────────────────
  {
    key: "careers",
    label: "Careers / Hiring",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Briefcase",
  },
  // ─────────────────────────────────────────────
  // 47. Franchise
  // ─────────────────────────────────────────────
  {
    key: "franchise",
    label: "Franchise Information",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "TrendingUp",
  },
  // ─────────────────────────────────────────────
  // 48. Privacy & Legal
  // ─────────────────────────────────────────────
  {
    key: "legal",
    label: "Privacy & Legal Links",
    category: "mandatory",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "Shield",
  },
  // ─────────────────────────────────────────────
  // 49. Footer
  // ─────────────────────────────────────────────
  {
    key: "footer",
    label: "Footer",
    category: "mandatory",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "AlignBottom",
  },
  // ─────────────────────────────────────────────
  // 50. Lead Forms
  // ─────────────────────────────────────────────
  {
    key: "lead_forms",
    label: "Custom Lead Forms",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "FileText",
  },
  // ─────────────────────────────────────────────
  // 51. SEO Sections
  // ─────────────────────────────────────────────
  {
    key: "seo",
    label: "SEO Optimized Area",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Search",
  },
  // ─────────────────────────────────────────────
  // 52. Accessibility Tools
  // ─────────────────────────────────────────────
  {
    key: "accessibility",
    label: "Accessibility Widget",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Eye",
  },
  // ─────────────────────────────────────────────
  // 53. Multi-language
  // ─────────────────────────────────────────────
  {
    key: "multilanguage",
    label: "Language Switcher",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Globe",
  },
  // ─────────────────────────────────────────────
  // 54. Announcement Bar
  // ─────────────────────────────────────────────
  {
    key: "announcement",
    label: "Announcement Banner",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Bell",
  },
  // ─────────────────────────────────────────────
  // 55. Popup Notifications
  // ─────────────────────────────────────────────
  {
    key: "popup_notifications",
    label: "Popup Notifications",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "AlertCircle",
  },
  // ─────────────────────────────────────────────
  // 56. Cookie Banner
  // ─────────────────────────────────────────────
  {
    key: "cookie",
    label: "Cookie Consent",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "FileQuestion",
  },
  // ─────────────────────────────────────────────
  // 57. Membership Verification
  // ─────────────────────────────────────────────
  {
    key: "verification",
    label: "Membership Verification Form",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "CheckCircle",
  },
  // ─────────────────────────────────────────────
  // 58. QR Check-in Info
  // ─────────────────────────────────────────────
  {
    key: "qr_info",
    label: "QR Attendance Info",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "QrCode",
  },
  // ─────────────────────────────────────────────
  // 59. Trainer Booking
  // ─────────────────────────────────────────────
  {
    key: "trainer_booking",
    label: "PT Booking Tool",
    category: "premium",
    defaultEnabled: false,
    defaultConfig: {},
    icon: "Calendar",
  },
  // ─────────────────────────────────────────────
  // 60. CTA Sections
  // ─────────────────────────────────────────────
  {
    key: "cta_sections",
    label: "Call to Action Modules",
    category: "essential",
    defaultEnabled: true,
    defaultConfig: {},
    icon: "MousePointer",
  },
];
