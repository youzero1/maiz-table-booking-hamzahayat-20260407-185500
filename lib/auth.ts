import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'mock-google-client-secret',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? 'mock-facebook-client-id',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? 'mock-facebook-client-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const isRestaurant = credentials.role === 'restaurant';
        if (credentials.email && credentials.password === 'password123') {
          return {
            id: isRestaurant ? 'rest-user-1' : 'consumer-user-1',
            name: isRestaurant ? 'Restaurant Manager' : 'John Doe',
            email: credentials.email,
            role: isRestaurant ? 'restaurant' : 'consumer',
            restaurantId: isRestaurant ? '1' : undefined,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; role?: string; restaurantId?: string };
        token.role = u.role ?? 'consumer';
        token.restaurantId = u.restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; restaurantId?: string }).role = (token.role as string) ?? 'consumer';
        (session.user as { role?: string; restaurantId?: string }).restaurantId = token.restaurantId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'maiz-secret-key-for-development-only',
};
