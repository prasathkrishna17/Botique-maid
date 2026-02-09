import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const navigationLinks = [
  { name: "Services", href: "/services" },
  { name: "Areas We Serve", href: "/areas" },
  { name: "Blog", href: "/blog" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

const legalLinks = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  return (
    // Updated Background to Slate-900 to match the dark theme elements
    <footer className="bg-slate-900 text-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <h3 className="text-3xl font-black mb-4 text-white tracking-tight">
              Botique Maid
            </h3>
            <p className="mb-8 leading-relaxed max-w-sm mx-auto md:mx-0 text-slate-400 font-medium">
              Homes That Deserve Extra Care.
            </p>

            <div className="flex justify-center md:justify-start space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6">Navigation</h4>
            <ul className="space-y-4">
              {navigationLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-500 transition-colors duration-300 block font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-500 transition-colors duration-300 block font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-500 transition-colors duration-300 block font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 mt-16 text-center text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} Botique Maid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}