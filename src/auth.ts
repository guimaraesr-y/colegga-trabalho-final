import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import AuthService, { LoginCredentials } from "./domain/auth/authService";

const authService = new AuthService();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: (credentials) => {
        return authService.login(credentials as LoginCredentials);
      }
    })
  ],
})
