import { Booking, Team } from '@/types';

const BOOKINGS_KEY = 'rpg-bookings';
const TEAMS_KEY = 'rpg-teams';

// Bookings storage functions
export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings).map((booking: any) => ({
      ...booking,
      createdAt: new Date(booking.createdAt)
    })) : [];
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

export function saveBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: 'pending'
  };
  
  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  
  return newBooking;
}

export function updateBooking(id: string, updates: Partial<Booking>): boolean {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  
  if (index === -1) return false;
  
  bookings[index] = { ...bookings[index], ...updates };
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  
  return true;
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const filteredBookings = bookings.filter(b => b.id !== id);
  
  if (filteredBookings.length === bookings.length) return false;
  
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filteredBookings));
  return true;
}

// Teams storage functions
export function getTeams(): Team[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const teams = localStorage.getItem(TEAMS_KEY);
    return teams ? JSON.parse(teams).map((team: any) => ({
      ...team,
      createdAt: new Date(team.createdAt),
      sessionDate: team.sessionDate ? new Date(team.sessionDate) : undefined
    })) : [];
  } catch (error) {
    console.error('Error loading teams:', error);
    return [];
  }
}

export function saveTeam(team: Omit<Team, 'id' | 'createdAt' | 'status'>): Team {
  const newTeam: Team = {
    ...team,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: 'draft'
  };
  
  const teams = getTeams();
  teams.push(newTeam);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  
  return newTeam;
}

export function updateTeam(id: string, updates: Partial<Team>): boolean {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === id);
  
  if (index === -1) return false;
  
  teams[index] = { ...teams[index], ...updates };
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  
  return true;
}

export function deleteTeam(id: string): boolean {
  const teams = getTeams();
  const filteredTeams = teams.filter(t => t.id !== id);
  
  if (filteredTeams.length === teams.length) return false;
  
  localStorage.setItem(TEAMS_KEY, JSON.stringify(filteredTeams));
  return true;
}

// Utility functions
export function getAvailableBookings(): Booking[] {
  return getBookings().filter(booking => booking.status === 'pending');
}

export function getMasterBookings(): Booking[] {
  return getAvailableBookings().filter(booking => booking.roles.includes('master'));
}

export function getPlayerBookings(): Booking[] {
  return getAvailableBookings().filter(booking => booking.roles.includes('player'));
}
