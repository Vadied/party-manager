'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const errorMessages: { [key: string]: string } = {
  Configuration: 'C\'è un problema con la configurazione del server.',
  AccessDenied: 'Non hai i permessi necessari per accedere.',
  Verification: 'Il token è scaduto o è già stato utilizzato.',
  Default: 'Si è verificato un errore durante l\'autenticazione.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Party Manager</h1>
            <p className="text-gray-600">Sistema di prenotazione GDR</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Errore di Autenticazione</h2>
            
            <p className="text-gray-600 mb-6">
              {errorMessages[error] || errorMessages.Default}
            </p>

            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors text-center font-medium"
              >
                Riprova l'accesso
              </Link>
              
              <Link
                href="/"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors text-center font-medium"
              >
                Torna alla homepage
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Se il problema persiste, contatta l'amministratore del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
