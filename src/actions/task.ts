'use server';

import { auth } from "@/auth";
import TaskService, { CreateTaskInput, TaskPageableOptions } from "@/domain/tasks/service";
import { Prisma } from "@prisma/client";

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

// If you got here with a IDOR vulnerability, good job!
// This way the system was build, it is not blocking accesses to other users' data
// If you wanna fix it, feel free to do open a PR :)
export const getTask = async (taskId: string) => {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  try {
    return await taskService.getTask(taskId);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};

export const getTasks = async (options: TaskPageableOptions) => {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  (options.where ??= {}).authorId = session.user.id;

  try {
    return await taskService.getTasks(options);
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
};

export const countTasks = async (options: Prisma.TaskCountArgs) => {
  try {
    return await taskService.countTasks(options)
  } catch (error) {
    return Object.assign({ error: true }, error) as { error: true, message: string };
  }
}