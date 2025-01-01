import AppError from "@/misc/appError";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Email ou senha inválidos!", "INVALID_CREDENTIALS");
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    this.name = this.constructor.name;
  }
}
