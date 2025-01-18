import { auth } from "@/auth";
import TaskService, { CreateTaskInput, TaskPageableOptions } from "@/domain/tasks/service";

const taskService = new TaskService();

export const createTask = async (taskData: CreateTaskInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  taskData.author = { 
    connect: { 
      id: session.user.id 
    } 
  };
  
  return await taskService.createTask(taskData);
};

export const toggleFinishTask = async (taskId: string, action: boolean) => {
  await taskService.toggleFinishTask(taskId, action);
};

export const getTask = async (taskId: string) => {
  return await taskService.getTask(taskId);
};

export const getTasks = async (options: TaskPageableOptions) => {
  return await taskService.getTasks(options);
};
