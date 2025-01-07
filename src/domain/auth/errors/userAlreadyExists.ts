import AppError from "@/misc/appError";

export class UserAlreadyExists extends AppError {
  constructor() {
    super("Esse usuário já existe!", "USER_ALREADY_EXISTS");
    Object.setPrototypeOf(this, UserAlreadyExists.prototype);
    this.name = this.constructor.name;
  }
}
