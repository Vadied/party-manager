export interface Booking {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  roles: Role[];
  gamingSystems: GamingSystem[];
  createdAt: Date;
  status: 'pending' | 'assigned' | 'cancelled';
}

export type Role = 'master' | 'player';

export type GamingSystem = 'DnD' | 'Daggerheart' | 'Vampiri' | 'Call of Cthulhu' | 'Pathfinder';

export interface Team {
  id: string;
  name: string;
  gamingSystem: GamingSystem;
  master: Booking;
  players: Booking[];
  maxPlayers: number;
  sessionDate?: Date;
  status: 'draft' | 'confirmed' | 'completed';
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export const GAMING_SYSTEMS: { value: GamingSystem; label: string }[] = [
  { value: 'DnD', label: 'Dungeons & Dragons' },
  { value: 'Daggerheart', label: 'Daggerheart' },
  { value: 'Vampiri', label: 'Vampiri: La Masquerade' },
  { value: 'Call of Cthulhu', label: 'Call of Cthulhu' },
  { value: 'Pathfinder', label: 'Pathfinder' },
];

export const ROLES: { value: Role; label: string }[] = [
  { value: 'master', label: 'Game Master' },
  { value: 'player', label: 'Giocatore' },
];

// NextAuth.js types extension
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }

  interface User {
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean;
  }
}
