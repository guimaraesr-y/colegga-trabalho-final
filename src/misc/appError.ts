export default class AppError extends Error {

  constructor(message: string, public code?: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = this.constructor.name;

    Object.defineProperty(this, "message", {
      enumerable: true,
    });
  }

}
