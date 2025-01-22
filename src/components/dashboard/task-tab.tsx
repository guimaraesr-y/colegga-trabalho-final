import { Button } from "../ui/button";
import { Task } from "@/domain/tasks/service";
import { BsTrash } from "react-icons/bs";

interface TasksTabProps {
  tasks: Task[];
  checkedStates: boolean[];
  handleCheck: (index: number) => void;
  newTask: string;
  setNewTask: (value: string) => void;
  onAddTask: () => void;
  onDeleteTask: (value: string) => void;
}

export default function TasksTab({
  tasks,
  checkedStates,
  handleCheck,
  newTask,
  setNewTask,
  onAddTask,
  onDeleteTask
}: TasksTabProps): JSX.Element {
  
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tarefas Recentes</h2>
      <div className="list-disc ml-6 text-gray-600 mb-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="mr-1"
                type="checkbox"
                checked={checkedStates[index]}
                onChange={() => handleCheck(index)}
              />
              <label
                className={`cursor-pointer ${
                  checkedStates[index] ? "line-through text-gray-400" : ""
                }`}
                onClick={() => handleCheck(index)}
              >
                {task.content}
              </label>
            </div>
            <Button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-med"
            >
              <BsTrash />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <Button
          onClick={onAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}