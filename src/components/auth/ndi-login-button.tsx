'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NDILoginModal } from './ndi-login-modal';

interface NDILoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onLoginSuccess?: (data: any) => void;
  onLoginError?: (error: string) => void;
}

export function NDILoginButton({
  className = '',
  variant = 'default',
  size = 'md',
  onLoginSuccess,
  onLoginError
}: NDILoginButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);

  const handleOpenModal = async () => {
    setIsModalOpen(true);

    // TODO: Fetch QR code from your backend API
    // Example:
    // try {
    //   const response = await fetch('/api/auth/ndi/qr-code');
    //   const data = await response.json();
    //   setQrCodeUrl(data.qrCodeUrl);
    // } catch (error) {
    //   console.error('Failed to fetch QR code:', error);
    //   onLoginError?.(Failed to generate QR code');
    // }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQrCodeUrl(undefined);
  };

  const handleQRCodeExpired = () => {
    console.log('QR Code expired');
    onLoginError?.('QR code has expired. Please try again.');
  };

  // Variant styles
  const variantStyles = {
    default:
      'bg-[#4DBB8E] text-white hover:bg-[#45a87e] shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-[#4DBB8E] text-[#4DBB8E] hover:bg-[#4DBB8E] hover:text-white',
    ghost: 'text-[#4DBB8E] hover:bg-[#4DBB8E]/10'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className} `}
      >
        <div className="relative h-6 w-6">
          <Image
            src="/NDI.png"
            alt="NDI Logo"
            fill
            className="object-contain"
          />
        </div>
        Login with Bhutan NDI
      </button>

      <NDILoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        qrCodeUrl={qrCodeUrl}
        onQRCodeExpired={handleQRCodeExpired}
      />
    </>
  );
}
