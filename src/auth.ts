import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter";
import AuthService, { LoginCredentials } from "./domain/auth/authService";
import { prisma } from "./lib/prisma";

const authService = new AuthService();

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                return await authService.login(credentials as LoginCredentials);
            }
        })
    ],
})
