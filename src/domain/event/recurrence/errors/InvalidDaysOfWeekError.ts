import AppError from "@/misc/appError";

export class InvalidDaysOfWeekError extends AppError {
  constructor() {
    super("Dias da semana inválidos!", "INVALID_DAYS_OF_WEEK");
    Object.setPrototypeOf(this, InvalidDaysOfWeekError.prototype);
    this.name = this.constructor.name;
  }
}
