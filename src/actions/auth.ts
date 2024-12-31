'use server';

import { signIn, signOut } from "@/auth";
import AuthService, { LoginCredentials, RegisterCredentials } from "@/domain/auth/authService";

const authService = new AuthService();

export const login = (credentials: LoginCredentials) => {
    return signIn("credentials", credentials);
}

export const register = (credentials: RegisterCredentials) => {
    return authService.register(credentials);
}

export const logout = async () => {
    return signOut()
}

export const getUser = (id: string) => {
    return authService.getUser(id);
}
