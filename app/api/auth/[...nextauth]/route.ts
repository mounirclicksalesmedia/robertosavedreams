// @ts-nocheck
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma/client';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Starting authorization process');
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          console.log('Looking up user:', credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
            },
          });

          if (!user || !user.password) {
            console.log('User not found or missing password');
            return null;
          }

          console.log('Found user, comparing passwords');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          console.log('User authenticated successfully:', user.id);
          const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
          console.log('Returning user:', userWithoutPassword);
          return userWithoutPassword;
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback - incoming token:', token, 'user:', user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log('JWT callback - outgoing token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - incoming session:', session, 'token:', token);
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log('Session callback - outgoing session:', session);
      return session;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}); 