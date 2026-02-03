'use client';

import { NDILoginButton } from './ndi-login-button';

/**
 * Demo page showing different variants of the NDI Login Button
 * This is for demonstration purposes only
 */
export function NDILoginDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            NDI Login Components Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Click any button below to see the NDI login modal
          </p>
        </div>

        {/* Default Variant */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Default Variant
          </h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Small Size
              </p>
              <NDILoginButton variant="default" size="sm" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Medium Size
              </p>
              <NDILoginButton variant="default" size="md" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Large Size
              </p>
              <NDILoginButton variant="default" size="lg" />
            </div>
          </div>
        </div>

        {/* Outline Variant */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Outline Variant
          </h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Small Size
              </p>
              <NDILoginButton variant="outline" size="sm" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Medium Size
              </p>
              <NDILoginButton variant="outline" size="md" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Large Size
              </p>
              <NDILoginButton variant="outline" size="lg" />
            </div>
          </div>
        </div>

        {/* Ghost Variant */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Ghost Variant
          </h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Small Size
              </p>
              <NDILoginButton variant="ghost" size="sm" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Medium Size
              </p>
              <NDILoginButton variant="ghost" size="md" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Large Size
              </p>
              <NDILoginButton variant="ghost" size="lg" />
            </div>
          </div>
        </div>

        {/* Full Width Example */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Full Width Example
          </h2>
          <NDILoginButton
            variant="default"
            size="lg"
            className="w-full"
            onLoginSuccess={(data: any) => {
              console.log('Login successful:', data);
              alert('Login successful! Check console for details.');
            }}
            onLoginError={(error: string) => {
              console.error('Login error:', error);
              alert(`Login error: ${error}`);
            }}
          />
        </div>

        {/* Usage Note */}
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            📝 Note
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This is a demo page. The QR code shown is a placeholder. In
            production, you'll need to integrate with your backend API to
            generate actual NDI QR codes. See the README.md file in the auth
            folder for integration instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
