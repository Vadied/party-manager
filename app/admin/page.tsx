'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Booking, Team } from '@/types';
import { getBookings, getTeams } from '@/lib/storage';
import BookingsList from '@/components/admin/BookingsList';
import TeamsList from '@/components/admin/TeamsList';
import CreateTeamModal from '@/components/admin/CreateTeamModal';

type Tab = 'bookings' | 'teams';

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookings(getBookings());
    setTeams(getTeams());
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const assignedBookings = bookings.filter(b => b.status === 'assigned');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600">
                Party Manager Admin
              </Link>
              <p className="text-gray-600">Gestione prenotazioni e team</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Prenotazioni ({pendingBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'teams'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Team ({teams.length})
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {session?.user && (
                  <div className="flex items-center space-x-2">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'Admin'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {session.user.name}
                      </div>
                      <div className="text-gray-500">Amministratore</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Disconnetti
                </button>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Torna al Sito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prenotazioni Totali</p>
                <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assegnati</p>
                <p className="text-2xl font-semibold text-gray-900">{assignedBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-md">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Creati</p>
                <p className="text-2xl font-semibold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Prenotazioni</h2>
              {pendingBookings.length > 0 && (
                <button
                  onClick={() => setIsCreateTeamOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Crea Nuovo Team
                </button>
              )}
            </div>
            <BookingsList bookings={bookings} onUpdate={loadData} />
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Team</h2>
              {pendingBookings.length > 0 && (
                <button
                  onClick={() => setIsCreateTeamOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Crea Nuovo Team
                </button>
              )}
            </div>
            <TeamsList teams={teams} onUpdate={loadData} />
          </div>
        )}

        {/* Create Team Modal */}
        {isCreateTeamOpen && (
          <CreateTeamModal
            isOpen={isCreateTeamOpen}
            onClose={() => setIsCreateTeamOpen(false)}
            onSuccess={loadData}
            availableBookings={pendingBookings}
          />
        )}
      </main>
    </div>
  );
}
