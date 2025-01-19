'use server';

import { auth } from "@/auth";
import TaskService, { CreateTaskInput, TaskPageableOptions } from "@/domain/tasks/service";

const taskService = new TaskService();

export const createTask = async (taskData: Omit<CreateTaskInput, 'author'>) => {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const createInput = { 
    ...taskData, 
    author: { connect: { email: session.user.email } } 
  } as CreateTaskInput;

  try {
    return await taskService.createTask(createInput);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};

export const toggleFinishTask = async (taskId: string, action: boolean) => {
  try {
    return await taskService.toggleFinishTask(taskId, action);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};

export const getTask = async (taskId: string) => {
  try {
    return await taskService.getTask(taskId);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};

export const getTasks = async (options: TaskPageableOptions) => {
  try {
    return await taskService.getTasks(options);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};
