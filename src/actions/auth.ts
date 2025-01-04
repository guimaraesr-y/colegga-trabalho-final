'use server';

import { signIn, signOut } from "@/auth";
import AuthService, { LoginCredentials, RegisterCredentials } from "@/domain/auth/authService";
import { InvalidCredentialsError } from "@/domain/auth/errors/invalidCredentialsError";

const authService = new AuthService();

export const login = async (credentials: LoginCredentials) => {
    try {
        return await signIn("credentials", {
            redirect: false,
            ...credentials
        });
    } catch {
        return Object.assign({ error: true }, new InvalidCredentialsError());
    }
}

export const register = async (credentials: RegisterCredentials) => {
    try {
        return await authService.register(credentials);
    } catch (error) {
        return Object.assign({ error: true }, error) as { error: true, message: string };
    }
}

export const logout = async () => {
    return signOut()
}

export const getUser = (id: string) => {
    return authService.getUser(id);
}

export const getUserByEmail = (email: string) => {
    return authService.getUserByEmail(email);
}
