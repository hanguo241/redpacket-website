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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white"
      style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold"
          style={{ fontSize: "16px", color: "#171717", letterSpacing: "-0.32px" }}>
          <span style={{ fontSize: "20px" }}>🧧</span>
          RedPacket
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:opacity-60"
                style={{ fontSize: "14px", fontWeight: 500, color: "#171717" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/app"
          className="hidden md:inline-flex items-center px-4 py-2 text-white font-medium transition-opacity hover:opacity-80"
          style={{ background: "#171717", borderRadius: "6px", fontSize: "14px" }}
        >
          立即接入
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          style={{ color: "#171717" }}
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
        <div className="md:hidden px-6 py-4 bg-white"
          style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontSize: "14px", fontWeight: 500, color: "#4d4d4d" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/app"
                className="inline-flex items-center px-4 py-2 text-white font-medium"
                style={{ background: "#171717", borderRadius: "6px", fontSize: "14px" }}
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
