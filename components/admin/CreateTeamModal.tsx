'use client';

import { useState, useMemo } from 'react';
import { Booking, GamingSystem, GAMING_SYSTEMS } from '@/types';
import { saveTeam, updateBooking } from '@/lib/storage';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBookings: Booking[];
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSuccess,
  availableBookings
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<GamingSystem | ''>('');
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [sessionDate, setSessionDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Filter masters and players based on selected system
  const availableMasters = useMemo(() => {
    return availableBookings.filter(booking => 
      booking.roles.includes('master') &&
      (selectedSystem === '' || booking.gamingSystems.includes(selectedSystem))
    );
  }, [availableBookings, selectedSystem]);

  const availablePlayers = useMemo(() => {
    return availableBookings.filter(booking => 
      booking.roles.includes('player') &&
      booking.id !== selectedMaster &&
      (selectedSystem === '' || booking.gamingSystems.includes(selectedSystem))
    );
  }, [availableBookings, selectedSystem, selectedMaster]);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else if (prev.length < maxPlayers) {
        return [...prev, playerId];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim() || !selectedSystem || !selectedMaster) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    setIsCreating(true);

    try {
      const masterBooking = availableBookings.find(b => b.id === selectedMaster)!;
      const playerBookings = availableBookings.filter(b => selectedPlayers.includes(b.id));

      // Create the team
      saveTeam({
        name: teamName.trim(),
        gamingSystem: selectedSystem,
        master: masterBooking,
        players: playerBookings,
        maxPlayers,
        sessionDate: sessionDate ? new Date(sessionDate) : undefined
      });

      // Update booking statuses
      updateBooking(selectedMaster, { status: 'assigned' });
      selectedPlayers.forEach(playerId => {
        updateBooking(playerId, { status: 'assigned' });
      });

      onSuccess();
      onClose();

      // Reset form
      setTeamName('');
      setSelectedSystem('');
      setSelectedMaster('');
      setSelectedPlayers([]);
      setMaxPlayers(4);
      setSessionDate('');

    } catch (error) {
      console.error('Errore durante la creazione del team:', error);
      alert('Errore durante la creazione del team');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Crea Nuovo Team</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Team *
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="es. Draghi della Notte"
                required
              />
            </div>

            {/* Gaming System */}
            <div>
              <label htmlFor="system" className="block text-sm font-medium text-gray-700 mb-2">
                Sistema di Gioco *
              </label>
              <select
                id="system"
                value={selectedSystem}
                onChange={(e) => {
                  setSelectedSystem(e.target.value as GamingSystem);
                  setSelectedMaster('');
                  setSelectedPlayers([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Seleziona sistema...</option>
                {GAMING_SYSTEMS.map(system => (
                  <option key={system.value} value={system.value}>
                    {system.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Players */}
            <div>
              <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 mb-2">
                Numero Massimo Giocatori
              </label>
              <select
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Game Master */}
            {selectedSystem && (
              <div>
                <label htmlFor="master" className="block text-sm font-medium text-gray-700 mb-2">
                  Game Master * ({availableMasters.length} disponibili)
                </label>
                {availableMasters.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Nessun master disponibile per questo sistema
                  </p>
                ) : (
                  <select
                    id="master"
                    value={selectedMaster}
                    onChange={(e) => setSelectedMaster(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Seleziona master...</option>
                    {availableMasters.map(master => (
                      <option key={master.id} value={master.id}>
                        {master.firstName} {master.lastName} ({master.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Players */}
            {selectedSystem && selectedMaster && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giocatori ({selectedPlayers.length}/{maxPlayers}) - {availablePlayers.length} disponibili
                </label>
                {availablePlayers.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Nessun giocatore disponibile per questo sistema
                  </p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-3">
                    {availablePlayers.map(player => (
                      <label key={player.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => handlePlayerToggle(player.id)}
                          disabled={!selectedPlayers.includes(player.id) && selectedPlayers.length >= maxPlayers}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {player.firstName} {player.lastName} ({player.email})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Session Date */}
            <div>
              <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data Sessione (opzionale)
              </label>
              <input
                type="datetime-local"
                id="sessionDate"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isCreating || !teamName.trim() || !selectedSystem || !selectedMaster}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creazione...' : 'Crea Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
