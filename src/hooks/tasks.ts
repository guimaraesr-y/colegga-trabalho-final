import * as actions from "@/actions/task";
import { CreateTaskInput, Task, TaskPageableOptions, TaskCountOptions } from "@/domain/tasks/service";
import { Pageable } from "@/misc/pageable";

export const useTasks = () => {
  
  const createTask = async (taskData: Omit<CreateTaskInput, 'author'>) => {
    const data = await actions.createTask(taskData);

    if (data && 'error' in data && data.error) {
      throw data.message;
    }

    return data;
  }

  const getTask = async (taskId: string) => {
    const data = await actions.getTask(taskId);

    if (data && 'error' in data && data.error) {
      throw data.message;
    }

    return data;
  }

  const getTasks = async (options: TaskPageableOptions) => {
    const data = await actions.getTasks(options);

    if (data && 'error' in data && data.error) {
      throw data.message;
    }

    return data as Pageable<Task>;
  }

  const toggleFinishTask = async (taskId: string, action: boolean) => {
    const data = await actions.toggleFinishTask(taskId, action);
    return data;
  }

  const countTasks = async (options: TaskCountOptions) => {
    const data = await actions.countTasks(options)
    if (typeof data != 'number' && 'error' in data && data.error) {
      throw data.message;
    }
    
    return data as number
  }
  
  return {
    createTask,
    getTask,
    getTasks,
    toggleFinishTask,
    countTasks
  }

};
