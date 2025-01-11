import BCrypt from "@/lib/bcrypt";
import { signInSchema, signUpSchema } from "./schema";
import BaseService from "@/misc/baseService";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { UserAlreadyExists } from "./errors/userAlreadyExists";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { UserNotFound } from "./errors/userNotFound";
import NotificationService from "../notification/service";

export type LoginCredentials = typeof signInSchema._type
export type RegisterCredentials = typeof signUpSchema._type
export type User = PrismaUser

export default class AuthService extends BaseService {

  private notificationService;

  constructor(prisma?: PrismaClient, notificationService = new NotificationService()) {
    super(prisma);
    this.notificationService = notificationService
  }

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

    this.sendRegisteredNotification(user);

    return user;
  }

  private async sendRegisteredNotification(user: User) {
    const notification = await this.notificationService.createNotification({
      title: user.name || '(Sem nome)',
      message: "Novo usuário cadastrado!",
      template: "welcome-user",
      model: "register",
      targets: {
        create: {
          userId: user.id
        }
      }
    })

    this.notificationService.sendNotification(notification)
  }

}
