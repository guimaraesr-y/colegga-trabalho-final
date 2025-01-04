import AppError from "@/misc/appError";

export class UserNotFound extends AppError {
  constructor() {
    super("Esse usuário já existe!", "USER_ALREADY_EXISTS");
    Object.setPrototypeOf(this, UserNotFound.prototype);
    this.name = this.constructor.name;
  }
}
