import { navItems } from "@/lib/constants";
import Link from "next/link";
import { Button } from "./ui/button";
import MobileNavigation from "./MobileNavigation";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT SECTION: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger - Visible only on mobile */}
            <div className="md:hidden">
              <MobileNavigation />
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Botique Maid
              </h1>
            </Link>
          </div>

          {/* CENTER SECTION: Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-bold transition-all px-4 py-2 rounded-full"
                  key={item.name}
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION: CTA Button (Always Visible) */}
          <div className="flex items-center">
            <Button asChild className="font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6" size="sm">
              <Link href="/manage-booking">
                Manage Booking
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </nav>
  );
}