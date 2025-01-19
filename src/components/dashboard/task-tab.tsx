import { useState } from "react";
import { Button } from "../ui/button";
import { useTasks } from "@/hooks/tasks";
import { Task } from "@/domain/tasks/service";

interface TasksTabProps {
  tasks: Task[];
  newTask: string;
  setNewTask: (value: string) => void;
  onAddTask: () => void;
}

export default function TasksTab({ 
  tasks, 
  newTask, 
  setNewTask, 
  onAddTask 
}: TasksTabProps): JSX.Element {
  const { toggleFinishTask } = useTasks();

  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(tasks.length).fill(false)
  );
  const handleCheck = (index: number) => {
    setCheckedStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );

    toggleFinishTask(tasks[index].id, !checkedStates[index]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tarefas Recentes</h2>
      <div className="list-disc ml-6 text-gray-600 mb-4">
        {tasks.map((task, index) => (
          <div key={index}>
            {/* TODO: receive done from task */}
            <input
              className="mr-1"
              type="checkbox"
              checked={checkedStates[index]}
              onChange={() => handleCheck(index)}
            />
            <label
              className={`cursor-pointer ${checkedStates[index] ? "line-through text-gray-400" : ""
                }`}
              onClick={() => handleCheck(index)}
            >
              {task.content}
            </label>
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
