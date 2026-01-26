import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background fixed inset-0 flex items-center justify-center overflow-hidden p-4">
      <div className="flex w-full max-w-5xl flex-col items-center text-center">
        {/* Single Logo */}
        <div className="relative mb-8 h-32 w-32 transition-transform duration-300 hover:scale-105">
          <Image
            src="/logo.png"
            alt="DCRC Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* English Text Only */}
        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tighter md:text-5xl">
          National Civil Registration System
        </h1>
        <h2 className="text-muted-foreground mb-5 text-xl font-semibold tracking-tight md:text-2xl">
          Department of Civil Registration & Census
        </h2>

        <p className="text-muted-foreground mb-8 max-w-lg text-lg">
          Secure access for authorized personnel only.
        </p>

        {/* Action Button */}
        <Link
          href="/login"
          className="shadow-primary/25 bg-primary text-primary-foreground flex items-center gap-3 rounded-xl px-8 py-4 font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
        >
          <span>Enter Secure Portal</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-muted-foreground/50 mt-8 text-xs">
          Restricted Access. For Authorized Official Use Only.
        </p>
      </div>
    </div>
  );
}
