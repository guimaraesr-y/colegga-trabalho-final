import BCrypt from "@/lib/bcrypt";
import { signInSchema, signUpSchema } from "./schema";
import BaseService from "@/misc/baseService";
import { User as PrismaUser } from "@prisma/client";

export type LoginCredentials = typeof signInSchema._type
export type RegisterCredentials = typeof signUpSchema._type
export type User = PrismaUser

export default class AuthService extends BaseService {

  async getUser(userId: string) {
    return this._prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this._prisma.user.findUnique({
      where: {
        email,
      },
    });
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
