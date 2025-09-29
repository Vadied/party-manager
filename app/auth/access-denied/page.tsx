'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AccessDeniedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Party Manager</h1>
            <p className="text-gray-600">Sistema di prenotazione GDR</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesso Negato</h2>
            
            <div className="space-y-4 text-left">
              <p className="text-gray-600">
                Ciao <strong>{session?.user?.name || session?.user?.email}</strong>,
              </p>
              
              <p className="text-gray-600">
                Non hai i permessi necessari per accedere al backoffice. 
                L'area di amministrazione è riservata agli organizzatori autorizzati.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Come ottenere l'accesso:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Contatta gli amministratori del sistema</li>
                  <li>• Richiedi l'aggiunta del tuo account agli organizzatori</li>
                  <li>• Verifica di aver effettuato l'accesso con l'account corretto</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors text-center font-medium"
              >
                Torna alla homepage
              </Link>
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Disconnetti e cambia account
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Per supporto tecnico, contatta gli amministratori del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
