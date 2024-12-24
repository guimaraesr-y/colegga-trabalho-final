import BCrypt from "@/lib/bcrypt";
import { signInSchema, signUpSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export type LoginCredentials = typeof signInSchema._type
export type RegisterCredentials = typeof signUpSchema._type

// TODO: Needs testing
export default class AuthService {

    async login(credentials: LoginCredentials) {
        const { email, password } = signInSchema.parse(credentials);
        
        const user = prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!user) {
            // TODO: Implement custom errors
            throw new Error("User not found");
        }

        if (!BCrypt.compare(password, email)) {
            // TODO: Implement custom errors
            throw new Error("Invalid credentials");
        }

        return user;
    }

    async register(credentials: RegisterCredentials) {
        const { email, password, name } = signUpSchema.parse(credentials);
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (userExists) {
            // TODO: Implement custom errors
            throw new Error("User already exists");
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: await BCrypt.hash(password),
                name,
            }
        });

        return user;
    }

}
