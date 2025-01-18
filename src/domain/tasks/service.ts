import { Prisma, PrismaClient, Task as PrismaTask } from "@prisma/client";
import NotificationService from "../notification/service";
import { TaskNotFound } from "./errors/taskNotFound";
import { PageableBaseService } from "@/misc/baseService";

export type Task = PrismaTask
export type CreateTaskInput = Prisma.TaskCreateInput
export type FlashPageableOptions = Prisma.TaskFindManyArgs

export default class TaskService extends PageableBaseService {

  model = this._prisma.task;

  private notificationService;

  constructor(prisma?: PrismaClient, notificationService = new NotificationService()) {
    super(prisma);
    this.notificationService = notificationService
  }

  async getTask(taskId: string) {
    const task = this._prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new TaskNotFound();
    }

    return task;
  }

  async getFlashes(options: FlashPageableOptions) {
    const pageableService = this.getPageableService<Task>();
    return await pageableService.getPageable(options);
  }

  async createTask(data: CreateTaskInput) {
    const task = await this._prisma.task.create({
      data,
    });

    return task;
  }

  async toggleFinishTask(taskId: string, action: boolean) {
    const task = await this.getTask(taskId);

    if (!task) {
      throw new TaskNotFound();
    }

    await this._prisma.$transaction(async (prisma) => {
      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          isDone: action,
        },
      });

      this.sendFinishedMessage(task);
    });
  }

  private async sendFinishedMessage(task: Task) {
    const notification = await this.notificationService.createNotification({
      title: "Sua tarefa foi finalizada!",
      message: "",
      template: "default",
      model: "task",
      targets: {
        create: {
          userId: task.authorId
        }
      }
    })

    await this.notificationService.sendNotification(notification);
  }

}
