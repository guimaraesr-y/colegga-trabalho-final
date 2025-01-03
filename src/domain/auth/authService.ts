import BCrypt from "@/lib/bcrypt";
import { signInSchema, signUpSchema } from "./schema";
import BaseService from "@/misc/baseService";
import { User as PrismaUser } from "@prisma/client";
import { UserAlreadyExists } from "./errors/userAlreadyExists";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { UserNotFound } from "./errors/userNotFound";

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
      throw new UserNotFound();
    }

    if (!BCrypt.compare(password, user.password!)) {
      throw new InvalidCredentialsError();
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
      throw new UserAlreadyExists();
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
