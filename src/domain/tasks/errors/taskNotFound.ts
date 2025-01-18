import AppError from "@/misc/appError";

export class TaskNotFound extends AppError {
  constructor() {
    super("Essa tarefa não existe!", "TASK_NOT_FOUND");
    Object.setPrototypeOf(this, TaskNotFound.prototype);
    this.name = this.constructor.name;
  }
}


