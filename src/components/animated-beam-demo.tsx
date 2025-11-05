"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const ServiceCard = forwardRef<
  HTMLDivElement,
  { className?: string; title: string; children?: React.ReactNode }
>(({ className, title, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex flex-col items-center justify-center rounded-full border-2 bg-white p-4 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] min-w-[120px] min-h-[120px]",
        className,
      )}
    >
      <div className="mb-2">{children}</div>
      <span className="text-xs font-medium text-center text-gray-700">{title}</span>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div10Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[820px] w-full items-center justify-center overflow-visible rounded-lg border bg-background p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex size-full flex-col max-w-4xl max-h-none items-stretch justify-between gap-8 -mt-8">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <Circle ref={div1Ref}>
              <Icons.agentBot />
            </Circle>
            <span className="text-xs font-medium text-gray-600">Sales Agent (FINA)</span>
          </div>
          <ServiceCard ref={div5Ref} title="Chat Onboarding">
            <Icons.budgetPlanning />
          </ServiceCard>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <Circle ref={div2Ref}>
              <Icons.agentBot />
            </Circle>
            <span className="text-xs font-medium text-gray-600">Verification Agent (VERA)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Circle ref={div4Ref} className="size-20">
              <Icons.robotMaster />
            </Circle>
            <span className="text-xs font-medium text-gray-600">Master (AURA)</span>
          </div>
          <ServiceCard ref={div6Ref} title="EMI Calculation">
            <Icons.investmentAdvice />
          </ServiceCard>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <Circle ref={div3Ref}>
              <Icons.agentBot />
            </Circle>
            <span className="text-xs font-medium text-gray-600">Underwriting Agent (CREDO)</span>
          </div>
          <ServiceCard ref={div7Ref} title="KYC Verification">
            <Icons.taxPlanning />
          </ServiceCard>
        </div>

        {/* Additional row for Eligibility Agent */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <Circle ref={div8Ref}>
              <Icons.agentBot />
            </Circle>
            <span className="text-xs font-medium text-gray-600">Eligibility Agent (ELIA)</span>
          </div>
          <ServiceCard ref={div10Ref} title="Eligibility Decision">
            <Icons.taxPlanning />
          </ServiceCard>
        </div>
        <div className="flex flex-row items-center justify-end">
          <ServiceCard ref={div9Ref} title="Sanction Letter">
            <Icons.financialHealth />
          </ServiceCard>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div7Ref}
        curvature={75}
        endYOffset={10}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div4Ref}
        curvature={50}
        endYOffset={15}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div10Ref}
        curvature={-100}
        endYOffset={-20}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div9Ref}
        curvature={100}
        endYOffset={20}
      />
    </div>
  );
}

const Icons = {
  agentBot: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head */}
      <rect x="6" y="8" width="12" height="10" rx="2" fill="#374151"/>
      {/* Antenna */}
      <circle cx="12" cy="6" r="1" fill="#374151"/>
      <rect x="11.5" y="4" width="1" height="4" fill="#374151"/>
      {/* Eyes */}
      <circle cx="9" cy="11" r="1.5" fill="white"/>
      <circle cx="15" cy="11" r="1.5" fill="white"/>
      {/* Body/base */}
      <ellipse cx="12" cy="20" rx="8" ry="2" fill="#374151"/>
      <rect x="8" y="18" width="8" height="4" rx="1" fill="#374151"/>
    </svg>
  ),
  robotMaster: () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head */}
      <rect x="12" y="15" width="24" height="21" rx="3" fill="#374151"/>
      {/* Antenna */}
      <circle cx="24" cy="12" r="2.25" fill="#374151"/>
      <rect x="23.25" y="9" width="1.5" height="6" fill="#374151"/>
      {/* Eyes */}
      <circle cx="18" cy="22.5" r="3" fill="white"/>
      <circle cx="30" cy="22.5" r="3" fill="white"/>
      {/* Side panels */}
      <rect x="9" y="21" width="3" height="6" fill="#374151"/>
      <rect x="36" y="21" width="3" height="6" fill="#374151"/>
      {/* Mouth/speaker grille */}
      <rect x="16.5" y="30" width="3" height="1.5" fill="white"/>
      <rect x="21" y="30" width="3" height="1.5" fill="white"/>
      <rect x="25.5" y="30" width="3" height="1.5" fill="white"/>
    </svg>
  ),
  divNode: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#6366F1" stroke="#4F46E5" strokeWidth="2"/>
      <rect x="7" y="7" width="4" height="4" rx="1" fill="white"/>
      <rect x="13" y="7" width="4" height="4" rx="1" fill="white"/>
      <rect x="7" y="13" width="10" height="4" rx="1" fill="white"/>
      <text x="12" y="22" textAnchor="middle" fontSize="8" fill="#374151">Div</text>
    </svg>
  ),
  budgetPlanning: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calculator body */}
      <rect x="4" y="3" width="16" height="18" rx="4" fill="#10B981" opacity="0.1"/>
      <rect x="4" y="3" width="16" height="18" rx="4" stroke="#10B981" strokeWidth="2" fill="none"/>
      {/* Screen */}
      <rect x="6" y="5" width="12" height="4" rx="2" fill="#10B981" opacity="0.2"/>
      {/* Buttons */}
      <circle cx="8" cy="12" r="1.5" fill="#10B981"/>
      <circle cx="12" cy="12" r="1.5" fill="#10B981"/>
      <circle cx="16" cy="12" r="1.5" fill="#10B981"/>
      <circle cx="8" cy="16" r="1.5" fill="#10B981"/>
      <circle cx="12" cy="16" r="1.5" fill="#10B981"/>
      <circle cx="16" cy="16" r="1.5" fill="#10B981"/>
      {/* Dollar sign */}
      <text x="12" y="7.5" textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="bold">$</text>
    </svg>
  ),
  investmentAdvice: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chart background */}
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#3B82F6" opacity="0.1"/>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="#3B82F6" strokeWidth="2" fill="none"/>
      {/* Growth arrow */}
      <path d="M6 16l4-4 3 3 5-7" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8h2v2" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Data points */}
      <circle cx="10" cy="12" r="2" fill="#10B981"/>
      <circle cx="13" cy="9" r="2" fill="#3B82F6"/>
      <circle cx="18" cy="6" r="2" fill="#F59E0B"/>
      {/* Trend indicator */}
      <path d="M17 6l2 2" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  taxPlanning: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document */}
      <rect x="4" y="2" width="14" height="20" rx="4" fill="#8B5CF6" opacity="0.1"/>
      <rect x="4" y="2" width="14" height="20" rx="4" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
      {/* Form lines */}
      <path d="M7 7h8M7 10h6M7 13h8M7 16h5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Percentage badge */}
      <circle cx="18" cy="6" r="3" fill="#8B5CF6"/>
      <text x="18" y="8" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">%</text>
      {/* Checkmark */}
      <path d="M6 18l2 2 4-4" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  financialHealth: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#EF4444"/>
      <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),
};