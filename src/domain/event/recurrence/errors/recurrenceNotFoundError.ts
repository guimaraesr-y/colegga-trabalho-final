import AppError from "@/misc/appError";

export class RecurrenceNotFoundError extends AppError {
  constructor() {
    super("A recorrência não foi encontrada!", "RECURRENCE_NOT_FOUND");
    Object.setPrototypeOf(this, RecurrenceNotFoundError.prototype);
    this.name = this.constructor.name;
  }
}
