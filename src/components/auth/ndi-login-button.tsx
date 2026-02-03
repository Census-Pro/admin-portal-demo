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
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setIsLoading(true);

    try {
      console.log('🔐 [NDI] Requesting proof request...');

      const response = await fetch('/api/auth/ndi/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proofName: 'Admin Login - Census System',
          attributes: ['ID Number', 'Full Name']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [NDI] Proof request failed:', errorData);
        throw new Error(
          errorData.details ||
            errorData.error ||
            'Failed to create NDI proof request'
        );
      }

      const data = await response.json();
      console.log('✅ [NDI] Proof Request created:', data);

      if (!data.proofRequestURL || !data.proofRequestThreadId) {
        console.error(
          '❌ [NDI] Invalid response - missing required fields:',
          data
        );
        throw new Error('Invalid response from NDI service');
      }

      setQrCodeUrl(data.proofRequestURL);
      setThreadId(data.proofRequestThreadId);
      setDeepLinkUrl(data.deepLinkURL);
    } catch (error) {
      console.error('❌ [NDI] Failed to fetch QR code:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate QR code';
      onLoginError?.(errorMessage);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQrCodeUrl(undefined);
    setThreadId(undefined);
    setDeepLinkUrl(undefined);
    setIsLoading(false);
  };

  const handleRefreshQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/ndi/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proofName: 'Admin Login - Census System',
          attributes: ['ID Number', 'Full Name']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create NDI proof request');
      }

      const data = await response.json();
      setQrCodeUrl(data.proofRequestURL);
      setThreadId(data.proofRequestThreadId);
      setDeepLinkUrl(data.deepLinkURL);
    } catch (error) {
      console.error('Failed to refresh QR code:', error);
      onLoginError?.('Failed to refresh QR code');
    } finally {
      setIsLoading(false);
    }
  };

  // Variant styles
  const variantStyles = {
    default:
      'bg-[#124143] text-white hover:bg-[#0d3133] shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-[#124143] text-[#124143] hover:bg-[#124143] hover:text-white',
    ghost: 'text-[#124143] hover:bg-[#124143]/10'
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
        threadId={threadId}
        deepLinkUrl={deepLinkUrl}
        isLoading={isLoading}
        onRefreshQRCode={handleRefreshQRCode}
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
      />
    </>
  );
}
