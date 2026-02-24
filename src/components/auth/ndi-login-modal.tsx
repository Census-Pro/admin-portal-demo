'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface NDILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
  threadId?: string;
  deepLinkUrl?: string;
  isLoading?: boolean;
  rememberMe?: boolean;
  onRefreshQRCode?: () => void;
  onLoginSuccess?: (data: any) => void;
  onLoginError?: (error: string) => void;
}

export function NDILoginModal({
  isOpen,
  onClose,
  qrCodeUrl,
  threadId,
  deepLinkUrl,
  isLoading = false,
  rememberMe = false,
  onRefreshQRCode,
  onLoginSuccess,
  onLoginError
}: NDILoginModalProps) {
  const [isQRExpired, setIsQRExpired] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState<string>('pending');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Waiting for verification...'
  );
  const [generatedQRCode, setGeneratedQRCode] = useState<string>('');
  const [qrGenerating, setQrGenerating] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const router = useRouter();

  // Create refs for callbacks and state to avoid SSE connection restarts
  const onLoginSuccessRef = useRef(onLoginSuccess);
  const onLoginErrorRef = useRef(onLoginError);
  const onCloseRef = useRef(onClose);
  const statusRef = useRef(verificationStatus);
  const rememberMeRef = useRef(rememberMe);

  // Keep refs in sync
  useEffect(() => {
    onLoginSuccessRef.current = onLoginSuccess;
  }, [onLoginSuccess]);

  useEffect(() => {
    onLoginErrorRef.current = onLoginError;
  }, [onLoginError]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    statusRef.current = verificationStatus;
  }, [verificationStatus]);

  useEffect(() => {
    rememberMeRef.current = rememberMe;
  }, [rememberMe]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Generate QR code from proof request URL (web URL) or deep link
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Use proofRequestURL if available (NDI's intended QR URL), fallback to deepLinkURL
    const urlForQR = qrCodeUrl || deepLinkUrl;

    if (!urlForQR) {
      return;
    }

    const generateQR = async () => {
      setQrGenerating(true);
      try {
        console.log('🎨 Generating QR code for URL:', urlForQR);
        const qrDataUrl = await QRCode.toDataURL(urlForQR, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setGeneratedQRCode(qrDataUrl);
        console.log('✅ QR code generated successfully');
      } catch (error) {
        console.error('❌ Failed to generate QR code:', error);
        if (onLoginError) {
          onLoginError('Failed to generate QR code');
        }
      } finally {
        setQrGenerating(false);
      }
    };

    generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCodeUrl, deepLinkUrl, isOpen]);

  // Listen to SSE stream for verification status
  useEffect(() => {
    if (!isOpen || !threadId) {
      return;
    }

    // Prevent multiple connections
    if (eventSourceRef.current) {
      console.log('⚠️ SSE connection already exists, closing old connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    console.log('🔌 Connecting to SSE stream for threadId:', threadId);
    setVerificationStatus('pending');
    setStatusMessage('Waiting for verification...');

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`/api/auth/ndi/stream/${threadId}`);
      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('❌ Failed to create SSE connection:', error);
      setVerificationStatus('error');
      setStatusMessage('Failed to establish connection. Please try again.');
      onLoginErrorRef.current?.('Connection failed');
      return;
    }

    eventSource.onmessage = async (event) => {
      try {
        // Skip keepalive messages
        if (event.data.trim() === '' || event.data.startsWith(':')) {
          console.log('💓 SSE keepalive');
          return;
        }

        console.log('📨 Raw SSE data:', event.data);
        const data = JSON.parse(event.data);
        console.log('📨 SSE message parsed:', data);

        if (data.status === 'verified' && data.loginData) {
          setVerificationStatus('verified');
          setStatusMessage('Verification successful! Logging in...');

          // Close SSE connection immediately upon success
          if (eventSourceRef.current) {
            console.log('🔌 Closing SSE connection after verification success');
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }

          // Use the tokens from loginData to sign in
          const { accessToken, refreshToken, user } = data.loginData;

          // Sign in with NextAuth using the tokens
          const result = await signIn('credentials', {
            redirect: false,
            accessToken,
            refreshToken,
            user: JSON.stringify(user),
            rememberMe: rememberMeRef.current ? 'true' : 'false'
          });

          if (result?.ok) {
            console.log('✅ Login successful via NDI');
            onLoginSuccessRef.current?.(data.loginData);
            toast.success('Login successful! Redirecting...', {
              description:
                'You have been successfully authenticated via Bhutan NDI.'
            });
            onCloseRef.current();

            // Add a delay to ensure the toast is seen and session is established
            // before redirecting to dashboard
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Use window.location for hard navigation to ensure
            // middleware sees the new session
            window.location.href = '/dashboard';
          } else {
            console.error('❌ NextAuth sign in failed:', result?.error);
            setVerificationStatus('failed');
            setStatusMessage('Login failed. Please try again.');
            toast.error('Login failed', {
              description:
                result?.error ||
                'Could not authenticate with provided credentials.'
            });
            onLoginErrorRef.current?.(result?.error || 'Login failed');
          }
        } else if (data.status === 'failed') {
          setVerificationStatus('failed');
          setStatusMessage(
            data.error || 'Verification failed. Please try again.'
          );
          toast.error('Verification Failed', {
            description: data.error || 'The authentication process failed.'
          });
          onLoginErrorRef.current?.(data.error || 'Verification failed');
          // Close connection after error
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        } else if (data.status === 'rejected') {
          setVerificationStatus('rejected');
          setStatusMessage('Verification was rejected.');
          toast.warning('Verification Rejected', {
            description:
              'The authentication request was rejected on your device.'
          });
          onLoginErrorRef.current?.('Verification rejected by user');
          // Close connection after rejection
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        } else if (data.status === 'timeout') {
          setVerificationStatus('timeout');
          setStatusMessage('Verification timed out. Please try again.');
          toast.error('Verification Timed Out', {
            description: 'The request has expired. Please refresh the QR code.'
          });
          onLoginErrorRef.current?.('Verification timeout');
          // Close connection after timeout
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      const currentStatus = statusRef.current;
      const readyState = eventSource.readyState;

      console.log('🔌 SSE connection state change:', {
        readyState,
        currentStatus,
        url: eventSource.url
      });

      // ReadyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
      // Only show error if:
      // 1. Connection is permanently closed (readyState === 2)
      // 2. We haven't received a successful verification yet
      // 3. We're not already showing an error
      if (readyState === 2 && currentStatus === 'pending') {
        console.error('❌ SSE connection failed during pending state');
        setVerificationStatus('error');
        setStatusMessage('Connection error. Please try again.');
        onLoginErrorRef.current?.('Connection error');
      } else if (readyState === 0) {
        console.log('🔄 SSE reconnecting...');
      } else if (currentStatus !== 'pending') {
        console.log('✅ SSE connection closed after successful verification');
        // Normal closure after verification - not an error
      }
    };

    return () => {
      if (eventSourceRef.current) {
        console.log('🔌 Closing SSE connection');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isOpen, threadId, router]);

  useEffect(() => {
    if (isOpen) {
      // Reset expired state when modal opens
      setIsQRExpired(false);

      // Removed frontend QR expiration timer - backend SSE handles timeout
      // The SSE connection will timeout after 5 minutes and send a 'timeout' status
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVideoGuide = () => {
    // Open Bhutan NDI YouTube channel in new tab
    window.open('https://www.youtube.com/@BhutanNDI', '_blank');
  };

  const handleOpenApp = () => {
    if (!deepLinkUrl) {
      console.warn('Deep link URL not available');
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    const playStoreUrl =
      'https://play.google.com/store/search?q=bhutan%20ndi&c=apps&hl=en_IN&gl=US';
    const appStoreUrl = 'https://apps.apple.com/in/app/bhutan-ndi/id1645493166';

    // Try to open the app with the deep link
    window.location.href = deepLinkUrl;

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
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
          role="dialog"
          aria-modal="true"
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
                      {isLoading || qrGenerating ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#4DBB8E]" />
                          <p className="text-sm font-medium text-gray-600">
                            Generating QR Code...
                          </p>
                        </div>
                      ) : isQRExpired ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="mb-4 text-sm font-medium text-gray-600">
                            QR Code Expired
                          </p>
                          <button
                            onClick={onRefreshQRCode}
                            className="rounded-full bg-[#4DBB8E] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#45a87e]"
                          >
                            Refresh
                          </button>
                        </div>
                      ) : generatedQRCode ? (
                        <div className="relative h-full w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={generatedQRCode}
                            alt="NDI QR Code"
                            className="h-full w-full rounded-lg object-contain"
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

                  {/* Verification Status */}
                  {verificationStatus !== 'pending' && (
                    <div
                      className={`mb-4 w-full rounded-lg p-3 text-center text-sm font-medium ${
                        verificationStatus === 'verified'
                          ? 'bg-green-50 text-green-700'
                          : verificationStatus === 'failed' ||
                              verificationStatus === 'rejected' ||
                              verificationStatus === 'timeout' ||
                              verificationStatus === 'error'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {statusMessage}
                    </div>
                  )}
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
                    disabled={isLoading || !deepLinkUrl}
                    className="group relative flex w-64 items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#124143] px-4 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#0d3133] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <div className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110">
                          <Image
                            src="/NDI.png"
                            alt="NDI Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span>Open NDI Wallet</span>
                      </>
                    )}
                  </button>

                  {/* Verification Status */}
                  {verificationStatus !== 'pending' && (
                    <div
                      className={`mt-4 w-full rounded-lg p-3 text-center text-sm font-medium ${
                        verificationStatus === 'verified'
                          ? 'bg-green-50 text-green-700'
                          : verificationStatus === 'failed' ||
                              verificationStatus === 'rejected' ||
                              verificationStatus === 'timeout' ||
                              verificationStatus === 'error'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {statusMessage}
                    </div>
                  )}
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
                    href="https://play.google.com/store/search?q=bhutan%20ndi&c=apps&hl=en_IN&gl=US"
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
          w{' '}
        </div>
      </div>
    </>
  );
}
