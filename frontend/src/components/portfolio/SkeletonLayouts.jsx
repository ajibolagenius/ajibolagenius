import React from 'react';
import { Skeleton } from '../ui/skeleton';

/* ─── Hero ─── */
export function HeroSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex items-center relative z-10">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8 w-full">
        <Skeleton className="w-[140px] h-[28px] mb-6" />
        <Skeleton className="w-[70%] max-w-[520px] h-[52px] mb-3" />
        <Skeleton className="w-[55%] max-w-[400px] h-[52px] mb-6" />
        <Skeleton className="w-[60%] max-w-[480px] h-[17px] mb-2" />
        <Skeleton className="w-[45%] max-w-[340px] h-[17px] mb-8" />
        <Skeleton className="w-[200px] h-[11px] mb-10" />
        <div className="flex gap-3">
          <Skeleton className="w-[150px] h-[42px]" />
          <Skeleton className="w-[150px] h-[42px]" />
        </div>
      </div>
    </div>
  );
}

/* ─── About ─── */
export function AboutSkeleton({ snapshot = false }) {
  return (
    <>
      <Skeleton className="w-[120px] h-[11px] mb-3" />
      <Skeleton className="w-[60%] max-w-[400px] h-[36px] mb-3" />
      <Skeleton className="w-[80%] max-w-[520px] h-[17px] mb-2" />
      <Skeleton className="w-[65%] max-w-[420px] h-[17px] mb-10" />
      {!snapshot && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-5 border border-[var(--border)]">
                <Skeleton className="w-[60px] h-[28px] mb-2" />
                <Skeleton className="w-[100px] h-[10px]" />
              </div>
            ))}
          </div>
          <Skeleton className="w-[120px] h-[11px] mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-[180px] h-[12px]" />
                <Skeleton className="flex-1 h-[3px]" />
                <Skeleton className="w-[30px] h-[11px]" />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ─── Projects ─── */
export function ProjectsSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-6">
          <Skeleton className="w-[80px] h-[10px] mb-3" />
          <Skeleton className="w-[70%] h-[20px] mb-2" />
          <Skeleton className="w-full h-[14px] mb-1" />
          <Skeleton className="w-[85%] h-[14px] mb-4" />
          <div className="flex gap-2">
            <Skeleton className="w-[60px] h-[22px]" />
            <Skeleton className="w-[60px] h-[22px]" />
            <Skeleton className="w-[60px] h-[22px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Single Project Detail ─── */
export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-[1160px] mx-auto px-4 md:px-8 py-12">
      <Skeleton className="w-[200px] h-[11px] mb-4" />
      <Skeleton className="w-[60%] h-[42px] mb-3" />
      <Skeleton className="w-[80%] h-[17px] mb-8" />
      <Skeleton className="w-full h-[300px] mb-8" />
      <Skeleton className="w-full h-[17px] mb-2" />
      <Skeleton className="w-[90%] h-[17px] mb-2" />
      <Skeleton className="w-[70%] h-[17px]" />
    </div>
  );
}

/* ─── CV / Timeline ─── */
export function CVSkeleton() {
  return (
    <>
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <Skeleton className="w-[100px] h-[11px] mb-3" />
        <Skeleton className="w-[50%] h-[48px] mb-4" />
        <Skeleton className="w-[60%] max-w-[560px] h-[17px] mb-8" />
        <div className="flex gap-3">
          <Skeleton className="w-[140px] h-[42px]" />
          <Skeleton className="w-[160px] h-[42px]" />
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto px-4 md:px-8 mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <Skeleton className="w-[160px] h-[11px] mb-8" />
            <div className="flex flex-col gap-6 pl-7">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-[60px] h-[11px] mb-2" />
                  <Skeleton className="w-[70%] h-[15px] mb-1" />
                  <Skeleton className="w-full h-[13px]" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="w-[160px] h-[11px] mb-6" />
            <div className="flex flex-col gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-full h-[12px] mb-1" />
                  <Skeleton className="w-full h-[3px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Courses ─── */
export function CoursesSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-6">
          <Skeleton className="w-[60px] h-[22px] mb-3" />
          <Skeleton className="w-[70%] h-[18px] mb-2" />
          <Skeleton className="w-full h-[14px] mb-1" />
          <Skeleton className="w-[80%] h-[14px] mb-4" />
          <Skeleton className="w-[100px] h-[14px]" />
        </div>
      ))}
    </div>
  );
}

/* ─── Writing / Blog list ─── */
export function WritingSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-col gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border-b border-[var(--border)] pb-6">
          <Skeleton className="w-[80px] h-[10px] mb-2" />
          <Skeleton className="w-[60%] h-[20px] mb-2" />
          <Skeleton className="w-full h-[14px] mb-1" />
          <Skeleton className="w-[85%] h-[14px]" />
        </div>
      ))}
    </div>
  );
}

/* ─── Single Blog Post ─── */
export function BlogPostSkeleton() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-8 py-12">
      <Skeleton className="w-[100px] h-[10px] mb-4" />
      <Skeleton className="w-[80%] h-[36px] mb-3" />
      <Skeleton className="w-[200px] h-[12px] mb-8" />
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="w-full h-[16px] mb-3" />
      ))}
    </div>
  );
}

/* ─── Gallery ─── */
export function GallerySkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="w-full aspect-[4/3]" />
      ))}
    </div>
  );
}

/* ─── Contact ─── */
export function ContactSkeleton() {
  return (
    <div className="max-w-[600px] mx-auto">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[42px]" />
        <Skeleton className="w-full h-[42px]" />
        <Skeleton className="w-full h-[42px]" />
        <Skeleton className="w-full h-[120px]" />
        <Skeleton className="w-[140px] h-[42px]" />
      </div>
    </div>
  );
}

/* ─── Ticker ─── */
export function TickerSkeleton() {
  return (
    <div className="w-full overflow-hidden bg-[var(--elevated)] border-t border-b border-[var(--border)] py-2">
      <div className="flex items-center gap-12 px-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-[120px] h-[11px] shrink-0" />
        ))}
      </div>
    </div>
  );
}

/* ─── Testimonials ─── */
export function TestimonialsSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border border-[var(--border)] p-6">
          <Skeleton className="w-[24px] h-[24px] mb-4" />
          <Skeleton className="w-full h-[14px] mb-2" />
          <Skeleton className="w-[85%] h-[14px] mb-2" />
          <Skeleton className="w-[60%] h-[14px] mb-4" />
          <Skeleton className="w-[100px] h-[13px] mb-1" />
          <Skeleton className="w-[140px] h-[10px]" />
        </div>
      ))}
    </div>
  );
}
