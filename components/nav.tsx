"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Costumes" },
  { href: "/gallery", label: "My Gallery" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-brand-900 text-white px-4 py-3">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          🪭 Garbtopia
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="rounded p-2 hover:bg-brand-800"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-brand-900 text-white px-4 pb-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded px-3 py-2 text-sm ${
                pathname === link.href ? "bg-brand-700 font-medium" : "hover:bg-brand-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 md:shrink-0 bg-brand-900 text-white min-h-screen sticky top-0 px-4 py-6 gap-1">
        <Link href="/" className="font-semibold text-xl tracking-tight mb-6 px-2">
          🪭 Garbtopia
        </Link>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded px-3 py-2 text-sm transition-colors ${
              pathname === link.href ? "bg-brand-700 font-medium" : "hover:bg-brand-800 text-brand-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-auto text-xs text-brand-200 px-2 pt-6">
          Try on cultural costumes, no photo-editing skills needed.
        </div>
      </aside>
    </>
  );
}
