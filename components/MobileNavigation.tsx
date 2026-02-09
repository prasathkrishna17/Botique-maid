"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"; 
// Make sure this path is correct for your project structure
import { navItems } from "@/lib/constants"; 
import Link from "next/link";
import { Button } from "./ui/button";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden p-0 hover:bg-slate-100 text-slate-900 -ml-2" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </Button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[64px] z-50 bg-white border-b border-slate-100 shadow-xl md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold text-lg px-4 py-3 rounded-xl transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile CTA Button (Optional: Adds the main action to mobile menu) */}
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/book" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl">
                  Get Instant Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}