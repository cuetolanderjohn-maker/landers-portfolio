import React from 'react';
import TechText from './TechText';
import Shuffle from './Shuffle';
import './TechText.css';
import './Shuffle.css';

/**
 * Complete Header and Centered Hero Page Component
 * With React Bits <TechText /> and <Shuffle />
 * - Header positioned all the way up (sticky/fixed at top: 0)
 * - Main Title: <TechText /> "LANDER JOHN D. CUETO"
 * - Subtitle: <Shuffle /> "Junior Web/Game Developer"
 */
export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-white overflow-x-hidden flex flex-col">
      {/* 
        HEADER NAVIGATION: Positioned all the way up (top: 0)
      */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[rgba(10,12,18,0.85)] backdrop-blur-md text-white border-b border-[rgba(255,255,255,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#profile" className="font-bold tracking-tight text-lg uppercase text-white no-underline">
            KULAS
          </a>
          <nav>
            <ul className="flex items-center gap-2 sm:gap-3 list-none m-0 p-0">
              <li>
                <a href="#profile" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] rounded hover:bg-[#ef233c] hover:border-[#ef233c] transition-colors no-underline text-[#cbd5e1] hover:text-white">
                  Profile
                </a>
              </li>
              <li>
                <a href="#projects" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] rounded hover:bg-[#ef233c] hover:border-[#ef233c] transition-colors no-underline text-[#cbd5e1] hover:text-white">
                  Projects
                </a>
              </li>
              <li>
                <a href="#skills" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] rounded hover:bg-[#ef233c] hover:border-[#ef233c] transition-colors no-underline text-[#cbd5e1] hover:text-white">
                  Skills
                </a>
              </li>
              <li>
                <a href="#background" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] rounded hover:bg-[#ef233c] hover:border-[#ef233c] transition-colors no-underline text-[#cbd5e1] hover:text-white">
                  Background
                </a>
              </li>
              <li>
                <a href="#contact" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] rounded hover:bg-[#ef233c] hover:border-[#ef233c] transition-colors no-underline text-[#cbd5e1] hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 
        HERO SECTION: Centered horizontally and vertically in viewport
      */}
      <section id="profile" className="relative flex-1 min-h-[calc(100vh-65px)] w-full flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Ambient background glow for high-contrast anime-noir aesthetic */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(239,35,60,0.12),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto text-center">
          {/*
            TechText Container Wrapper:
            Explicit width, height, and relative positioning constraints
          */}
          <div
            className="relative w-full max-w-4xl flex items-center justify-center"
            style={{ width: '100%', height: '240px', position: 'relative' }}
          >
            <TechText
              text="LANDER JOHN D. CUETO"
              color="#FFFFFF"
              accentColor="#EF233C"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              selection={true}
              draggable={true}
              labels={true}
              speed={1}
              sweep={true}
            />
          </div>

          {/*
            Subtitle / Role: <Shuffle />
            Directly below TechText container with font size preserved from Shuffle.css
          */}
          <div className="mt-6 flex justify-center w-full overflow-hidden">
            <Shuffle
              text="Junior Web/Game Developer"
              tag="p"
              textAlign="center"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              scrambleCharset="!@#$%^&*()_+~|}{[]:;?><=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              colorTo="#94A3B8"
              className="tracking-wider text-[#94A3B8]"
            />
          </div>

          {/* Location */}
          <p className="mt-4 font-mono text-xs sm:text-sm text-[#64748b] tracking-wider uppercase">
            Pasig City, Philippines
          </p>
        </div>
      </section>
    </div>
  );
}
