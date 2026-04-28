'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  IconShieldCheck,
  IconShieldX,
  IconShieldHalf,
  IconScan,
  IconFocus2,
  IconLoader2,
  IconActivity,
  IconFingerprint
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

interface PhotoComparisonProps {
  censusPhotoUrl: string;
  uploadedPhotoUrl: string;
  matchScore: number; // 0–100
}

function MatchBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <Badge className="gap-1.5 border-none bg-green-500 px-3 py-1 text-xs font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all hover:bg-green-600">
        <IconShieldCheck className="h-4 w-4" />
        VERIFIED MATCH
      </Badge>
    );
  }
  if (score >= 50) {
    return (
      <Badge className="gap-1.5 border-none bg-yellow-500 px-3 py-1 text-xs font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:bg-yellow-600">
        <IconShieldHalf className="h-4 w-4" />
        CAUTION: REVIEW
      </Badge>
    );
  }
  return (
    <Badge className="gap-1.5 border-none bg-red-500 px-3 py-1 text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-600">
      <IconShieldX className="h-4 w-4" />
      MATCH FAILED
    </Badge>
  );
}

export function PhotoComparison({
  censusPhotoUrl,
  uploadedPhotoUrl,
  matchScore
}: PhotoComparisonProps) {
  const [imagesLoaded, setImagesLoaded] = useState({
    census: false,
    uploaded: false
  });
  const allLoaded = imagesLoaded.census && imagesLoaded.uploaded;

  const barColor =
    matchScore >= 80
      ? 'bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]'
      : matchScore >= 50
        ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
        : 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]';

  const textColor =
    matchScore >= 80
      ? 'text-green-600'
      : matchScore >= 50
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-1000">
      {/* Photo Grid with Biometric Accents */}
      <div className="group relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Connection Icon Aesthetic */}
        <div className="absolute top-1/2 left-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <div
            className={`rounded-full border-2 bg-white p-3 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:bg-slate-900 ${allLoaded ? 'border-primary' : 'animate-pulse border-slate-200'} `}
          >
            {allLoaded ? (
              <IconActivity className={`h-6 w-6 ${textColor}`} />
            ) : (
              <IconLoader2 className="h-6 w-6 animate-spin text-slate-400" />
            )}
          </div>
        </div>

        {/* Census record photo */}
        <div className="relative space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2">
              <IconFingerprint className="text-primary h-4 w-4" />
              <p className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                Census Image
              </p>
            </span>
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 px-2 py-0 font-mono text-[10px] dark:bg-slate-900"
            >
              DCRC_REF
            </Badge>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500 ${allLoaded ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950' : 'border-primary/20 bg-primary/5 shadow-inner'} group/photo`}
            style={{ height: '360px' }}
          >
            {/* Loading Overlay */}
            {!imagesLoaded.census && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm dark:bg-slate-950/80">
                <div className="flex flex-col items-center gap-3">
                  <IconLoader2 className="text-primary h-8 w-8 animate-spin" />
                  <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                    Initializing Scope
                  </p>
                </div>
              </div>
            )}

            {/* Corner Accents */}
            <div className="border-primary/20 absolute top-4 left-4 z-20 h-6 w-6 rounded-tl-sm border-t-2 border-l-2" />
            <div className="border-primary/20 absolute top-4 right-4 z-20 h-6 w-6 rounded-tr-sm border-t-2 border-r-2" />
            <div className="border-primary/20 absolute bottom-4 left-4 z-20 h-6 w-6 rounded-bl-sm border-b-2 border-l-2" />
            <div className="border-primary/20 absolute right-4 bottom-4 z-20 h-6 w-6 rounded-br-sm border-r-2 border-b-2" />

            <Image
              src={censusPhotoUrl}
              alt="Census Record Photo"
              fill
              className={`object-contain p-4 transition-all duration-700 ${allLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} group-hover/photo:scale-110`}
              onLoadingComplete={() =>
                setImagesLoaded((prev) => ({ ...prev, census: true }))
              }
              priority
            />
          </div>
        </div>

        {/* Current uploaded photo */}
        <div className="relative space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2">
              <IconFocus2 className="text-primary h-4 w-4" />
              <p className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                Current Photo
              </p>
            </span>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary px-2 py-0 font-mono text-[10px]"
            >
              LIVE SYSTEM
            </Badge>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500 ${allLoaded ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950' : 'border-primary/20 bg-primary/5 shadow-inner'} group/photo`}
            style={{ height: '360px' }}
          >
            {/* Loading Overlay */}
            {!imagesLoaded.uploaded && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm dark:bg-slate-950/80">
                <div className="flex flex-col items-center gap-3">
                  <IconLoader2 className="text-primary h-8 w-8 animate-spin" />
                  <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                    Intake Stream Active
                  </p>
                </div>
              </div>
            )}

            {/* Corner Accents */}
            <div className="border-primary/20 absolute top-4 left-4 z-20 h-6 w-6 rounded-tl-sm border-t-2 border-l-2" />
            <div className="border-primary/20 absolute top-4 right-4 z-20 h-6 w-6 rounded-tr-sm border-t-2 border-r-2" />
            <div className="border-primary/20 absolute bottom-4 left-4 z-20 h-6 w-6 rounded-bl-sm border-b-2 border-l-2" />
            <div className="border-primary/20 absolute right-4 bottom-4 z-20 h-6 w-6 rounded-br-sm border-r-2 border-b-2" />

            <Image
              src={uploadedPhotoUrl}
              alt="Uploaded Photo"
              fill
              className={`object-contain p-4 transition-all duration-700 ${allLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} group-hover/photo:scale-110`}
              onLoadingComplete={() =>
                setImagesLoaded((prev) => ({ ...prev, uploaded: true }))
              }
            />
          </div>
        </div>
      </div>

      {/* Simplified Comparison Results Card */}
      <div
        className={`relative overflow-hidden border-2 transition-all duration-700 ${allLoaded ? 'translate-y-0 border-slate-200 bg-white opacity-100 dark:border-slate-800 dark:bg-slate-950' : 'translate-y-4 border-slate-100 opacity-50'} rounded-2xl p-6 shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest text-slate-500 uppercase">
              <IconScan className={`h-4 w-4 ${textColor}`} />
              Match Probability
            </h4>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-black tracking-tighter tabular-nums ${textColor}`}
              >
                {matchScore.toFixed(2)}%
              </span>
              <MatchBadge score={matchScore} />
            </div>
          </div>

          <div className="ml-8 max-w-[50%] flex-1">
            <div className="relative h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-in-out ${barColor}`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
