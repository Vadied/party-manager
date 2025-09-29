'use client';

import { useState } from 'react';
import { Team, GAMING_SYSTEMS } from '@/types';
import { updateTeam, deleteTeam } from '@/lib/storage';
import EmailModal from './EmailModal';

interface TeamsListProps {
  teams: Team[];
  onUpdate: () => void;
}

export default function TeamsList({ teams, onUpdate }: TeamsListProps) {
  const [filter, setFilter] = useState<'all' | 'draft' | 'confirmed' | 'completed'>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const filteredTeams = teams.filter(team => {
    if (filter === 'all') return true;
    return team.status === filter;
  });

  const handleStatusChange = (teamId: string, newStatus: Team['status']) => {
    updateTeam(teamId, { status: newStatus });
    onUpdate();
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo team?')) {
      deleteTeam(teamId);
      onUpdate();
    }
  };

  const handleSendEmail = (team: Team) => {
    setSelectedTeam(team);
    setIsEmailModalOpen(true);
  };

  const getStatusBadge = (status: Team['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      draft: 'Bozza',
      confirmed: 'Confermato',
      completed: 'Completato'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSystemLabel = (system: string) => {
    const systemData = GAMING_SYSTEMS.find(s => s.value === system);
    return systemData ? systemData.label : system;
  };

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun team creato</h3>
        <p className="text-gray-600">I team creati dalle prenotazioni appariranno qui.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-4">
            {[
              { value: 'all', label: 'Tutti' },
              { value: 'draft', label: 'Bozze' },
              { value: 'confirmed', label: 'Confermati' },
              { value: 'completed', label: 'Completati' }
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

        {/* Teams Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{getSystemLabel(team.gamingSystem)}</p>
                  </div>
                  {getStatusBadge(team.status)}
                </div>

                {/* Master */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Game Master</h4>
                  <div className="bg-indigo-50 p-3 rounded-md">
                    <div className="text-sm font-medium text-gray-900">
                      {team.master.firstName} {team.master.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{team.master.email}</div>
                  </div>
                </div>

                {/* Players */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Giocatori ({team.players.length}/{team.maxPlayers})
                  </h4>
                  <div className="space-y-2">
                    {team.players.map((player) => (
                      <div key={player.id} className="bg-gray-50 p-2 rounded-md">
                        <div className="text-sm font-medium text-gray-900">
                          {player.firstName} {player.lastName}
                        </div>
                        <div className="text-xs text-gray-600">{player.email}</div>
                      </div>
                    ))}
                    {Array.from({ length: team.maxPlayers - team.players.length }).map((_, idx) => (
                      <div key={idx} className="bg-gray-100 p-2 rounded-md border-2 border-dashed border-gray-300">
                        <div className="text-sm text-gray-500 italic">Posto libero</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Date */}
                {team.sessionDate && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Data Sessione</h4>
                    <p className="text-sm text-gray-900">
                      {team.sessionDate.toLocaleDateString('it-IT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <select
                    value={team.status}
                    onChange={(e) => handleStatusChange(team.id, e.target.value as Team['status'])}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="draft">Bozza</option>
                    <option value="confirmed">Confermato</option>
                    <option value="completed">Completato</option>
                  </select>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSendEmail(team)}
                      className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Invia Email
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Creato il {team.createdAt.toLocaleDateString('it-IT')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTeams.length === 0 && filter !== 'all' && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nessun team trovato per il filtro selezionato.</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && selectedTeam && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
        />
      )}
    </>
  );
}
