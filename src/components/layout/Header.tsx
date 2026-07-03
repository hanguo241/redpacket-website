"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/app", label: "红包应用" },
  { href: "/docs", label: "开发文档" },
  { href: "/pricing", label: "定价" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-base text-[#171717] tracking-[-0.32px]">
          <span className="text-xl">🧧</span>
          RedPacket
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-[#171717] transition-colors hover:opacity-60"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/app"
          className="hidden md:inline-flex items-center px-4 py-2 bg-[#171717] text-white text-sm font-medium rounded-[6px] transition-opacity hover:opacity-80"
        >
          立即接入
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#171717]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#4d4d4d]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/app"
                className="inline-flex items-center px-4 py-2 bg-[#171717] text-white text-sm font-medium rounded-[6px]"
                onClick={() => setMobileOpen(false)}
              >
                立即接入
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
