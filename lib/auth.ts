import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Puoi aggiungere logica personalizzata qui
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Aggiungi informazioni personalizzate alla sessione
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        session.user.isAdmin = adminEmails.includes(session.user.email);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        token.isAdmin = adminEmails.includes(user.email || '');
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Utility function per verificare se un utente è admin
export function isUserAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}
