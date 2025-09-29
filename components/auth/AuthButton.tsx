'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="bg-gray-200 animate-pulse rounded-md px-4 py-2 w-24 h-10"></div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/auth/signin"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          Accedi
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        {/* Admin button - only show if user is admin */}
        {session.user?.isAdmin && (
          <Link
            href="/admin"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Backoffice
          </Link>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="text-sm font-medium hidden sm:block">
              {session.user?.name || session.user?.email}
            </span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">{session.user?.name}</div>
                <div className="text-xs text-gray-500">{session.user?.email}</div>
                {session.user?.isAdmin && (
                  <div className="text-xs text-indigo-600 font-medium mt-1">Amministratore</div>
                )}
              </div>
              
              {!session.user?.isAdmin && (
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                  Accesso al backoffice non autorizzato
                </div>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Disconnetti
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}
