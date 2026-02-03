'use client';

import { useState, useEffect } from 'react';
import { X, Play, ScanLine } from 'lucide-react';
import Image from 'next/image';

interface NDILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
  onQRCodeExpired?: () => void;
}

export function NDILoginModal({
  isOpen,
  onClose,
  qrCodeUrl,
  onQRCodeExpired
}: NDILoginModalProps) {
  const [isQRExpired, setIsQRExpired] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset expired state when modal opens
      setIsQRExpired(false);

      // Set a timer for QR code expiration (e.g., 5 minutes)
      const timer = setTimeout(
        () => {
          setIsQRExpired(true);
          onQRCodeExpired?.();
        },
        5 * 60 * 1000
      );

      return () => clearTimeout(timer);
    }
  }, [isOpen, onQRCodeExpired]);

  if (!isOpen) return null;

  const handleVideoGuide = () => {
    // Open Bhutan NDI YouTube channel in new tab
    window.open('https://www.youtube.com/@BhutanNDI', '_blank');
  };

  const handleOpenApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    const appScheme = 'bhutanndi://'; // This is a common pattern, if it's different it should be updated
    const playStoreUrl =
      'https://play.google.com/store/apps/details?id=bt.gov.riti.ndi.wallet';
    const appStoreUrl = 'https://apps.apple.com/in/app/bhutan-ndi/id1645493166';

    // Try to open the app
    window.location.href = appScheme;

    // Fallback to store after a short delay
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        if (isAndroid) {
          window.open(playStoreUrl, '_blank');
        } else if (isIOS) {
          window.open(appStoreUrl, '_blank');
        }
      }
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-gray-400 backdrop-blur-sm transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Scrollable Content Container */}
          <div className="scrollbar-hide max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center px-6 py-10 sm:px-8">
              {/* Header */}
              <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 sm:mb-8 sm:text-2xl">
                {isMobile ? (
                  <>
                    Login with{' '}
                    <span className="text-[#4DBB8E]">Bhutan NDI</span>
                  </>
                ) : (
                  <>
                    Scan with <span className="text-[#4DBB8E]">Bhutan NDI</span>{' '}
                    wallet
                  </>
                )}
              </h2>

              {/* Desktop View: QR Code */}
              {!isMobile && (
                <>
                  <div className="relative mb-6 sm:mb-8">
                    {/* QR Code Container */}
                    <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-[#4DBB8E] bg-white p-4 sm:h-64 sm:w-64">
                      {isQRExpired ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="mb-4 text-sm font-medium text-gray-600">
                            QR Code Expired
                          </p>
                          <button
                            onClick={() => {
                              setIsQRExpired(false);
                              // Trigger QR code refresh logic here
                            }}
                            className="rounded-full bg-[#4DBB8E] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#45a87e]"
                          >
                            Refresh
                          </button>
                        </div>
                      ) : qrCodeUrl ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={qrCodeUrl}
                            alt="NDI QR Code"
                            fill
                            className="rounded-lg object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg sm:h-12 sm:w-12">
                              <Image
                                src="/NDI.png"
                                alt="NDI Logo"
                                width={28}
                                height={28}
                                className="object-contain sm:h-8 sm:w-8"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Placeholder QR Code
                        <div className="flex h-full w-full items-center justify-center bg-gray-50">
                          <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                            {/* QR Code Pattern Placeholder */}
                            <div className="grid h-full w-full grid-cols-8 gap-0.5 sm:gap-1">
                              {Array.from({ length: 64 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    Math.random() > 0.5
                                      ? 'bg-black'
                                      : 'bg-white'
                                  } rounded-[1px]`}
                                />
                              ))}
                            </div>
                            {/* NDI Logo in Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg sm:h-12 sm:w-12">
                                <Image
                                  src="/NDI.png"
                                  alt="NDI Logo"
                                  width={28}
                                  height={28}
                                  className="object-contain sm:h-8 sm:w-8"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Instructions */}
                  <div className="mb-6 w-full space-y-2 text-center">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      1. Open Bhutan NDI on your phone
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      2. Tap the Scan button located on the menu bar and capture
                      code
                    </p>
                  </div>
                </>
              )}

              {/* Mobile View: Deep Link */}
              {isMobile && (
                <div className="mb-8 flex w-full flex-col items-center">
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-[#4DBB8E]/5 p-6 sm:h-40 sm:w-40">
                    <div className="relative h-full w-full">
                      <Image
                        src="/NDI.png"
                        alt="NDI LogoLarge"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="mb-8 text-center">
                    <p className="text-sm text-gray-600">
                      Tap the button below to authenticate using your NDI Wallet
                      app.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenApp}
                    className="group relative flex w-64 items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-[#4DBB8E] bg-white px-4 py-3.5 font-bold text-[#4DBB8E] shadow-sm transition-all duration-300 hover:bg-[#4DBB8E] hover:text-white hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src="/NDI.png"
                        alt="NDI Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>Open NDI Wallet</span>
                  </button>
                </div>
              )}
              {/* Video Guide Button (Shared) */}
              <button
                onClick={handleVideoGuide}
                className="mb-8 flex items-center gap-2 rounded-full bg-[#4DBB8E] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-[#45a87e] hover:shadow-xl sm:px-6 sm:py-3 sm:text-base"
              >
                Watch video guide
                <Play className="h-4 w-4 fill-white" />
              </button>
              {/* Download Section */}
              <div className="w-full">
                <p className="mb-3 text-center text-xs font-medium text-gray-400 uppercase sm:text-sm">
                  Download Now!
                </p>
                <div className="flex items-center justify-center gap-3">
                  {/* Google Play Badge */}
                  <a
                    href="https://play.google.com/store/apps/details?id=bt.gov.riti.ndi.wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <div className="overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md hover:brightness-105">
                      <Image
                        src="/PlayStore.png"
                        alt="Get it on Google Play"
                        width={120}
                        height={36}
                        className="h-[36px] w-auto sm:h-[42px]"
                      />
                    </div>
                  </a>

                  {/* App Store Badge */}
                  <a
                    href="https://apps.apple.com/in/app/bhutan-ndi/id1645493166"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <div className="overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md hover:brightness-105">
                      <Image
                        src="/AppStore.png"
                        alt="Download on the App Store"
                        width={120}
                        height={36}
                        className="h-[36px] w-auto sm:h-[42px]"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
