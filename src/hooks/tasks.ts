import * as actions from "@/actions/task";
import { CreateTaskInput, Task, TaskPageableOptions } from "@/domain/tasks/service";
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
  
  return {
    createTask,
    getTask,
    getTasks,
    toggleFinishTask,
  }

};
