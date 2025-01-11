import AppError from "@/misc/appError";

export class EventNotFoundError extends AppError {
  constructor() {
    super("O evento não foi encontrado!", "EVENT_NOT_FOUND");
    Object.setPrototypeOf(this, EventNotFoundError.prototype);
    this.name = this.constructor.name;
  }
}
