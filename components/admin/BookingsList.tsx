'use client';

import { useState } from 'react';
import { Booking, GAMING_SYSTEMS } from '@/types';
import { updateBooking } from '@/lib/storage';

interface BookingsListProps {
  bookings: Booking[];
  onUpdate: () => void;
}

export default function BookingsList({ bookings, onUpdate }: BookingsListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'cancelled'>('all');

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    updateBooking(bookingId, { status: newStatus });
    onUpdate();
  };

  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: 'In Attesa',
      assigned: 'Assegnato',
      cancelled: 'Cancellato'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSystemLabels = (systems: string[]) => {
    return systems.map(system => {
      const systemData = GAMING_SYSTEMS.find(s => s.value === system);
      return systemData ? systemData.label : system;
    }).join(', ');
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna prenotazione</h3>
        <p className="text-gray-600">Le prenotazioni ricevute appariranno qui.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-4">
          {[
            { value: 'all', label: 'Tutte' },
            { value: 'pending', label: 'In Attesa' },
            { value: 'assigned', label: 'Assegnate' },
            { value: 'cancelled', label: 'Cancellate' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giocatore
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contatti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ruolo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sistemi Preferiti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.firstName} {booking.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{booking.pronouns}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.email}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {booking.roles.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {role === 'master' ? 'GM' : 'Giocatore'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {getSystemLabels(booking.gamingSystems)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.createdAt.toLocaleDateString('it-IT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                    className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="pending">In Attesa</option>
                    <option value="assigned">Assegnato</option>
                    <option value="cancelled">Cancellato</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && filter !== 'all' && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nessuna prenotazione trovata per il filtro selezionato.</p>
        </div>
      )}
    </div>
  );
}
