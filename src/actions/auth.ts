'use server';

import AuthService, { RegisterCredentials } from "@/domain/auth/authService";

const authService = new AuthService();

export const register = (credentials: RegisterCredentials) => {
    return authService.register(credentials);
}