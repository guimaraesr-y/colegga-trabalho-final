import BCrypt from "@/lib/bcrypt";
import { signInSchema, signUpSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

export type LoginCredentials = typeof signInSchema._type
export type RegisterCredentials = typeof signUpSchema._type

// TODO: Needs testing
export default class AuthService {

    private _prisma: PrismaClient;

    constructor(_prisma: PrismaClient = prisma) {
        this._prisma = _prisma;
    }

    async login(credentials: LoginCredentials) {
        const { email, password } = signInSchema.parse(credentials);
        
        const user = await this._prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!user) {
            // TODO: Implement custom errors
            throw new Error("User not found");
        }

        console.log(user, password, user.password, BCrypt.compare(password, user.password!))
        if (!BCrypt.compare(password, user.password!)) {
            // TODO: Implement custom errors
            throw new Error("Invalid credentials");
        }

        return user;
    }

    async register(credentials: RegisterCredentials) {
        const { email, password, name } = signUpSchema.parse(credentials);
        const userExists = await this._prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (userExists) {
            // TODO: Implement custom errors
            throw new Error("User already exists");
        }

        const user = await this._prisma.user.create({
            data: {
                email,
                password: BCrypt.hash(password),
                name,
            }
        });

        return user;
    }

}
