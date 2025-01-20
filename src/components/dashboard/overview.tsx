import { getTasks } from "@/actions/task";
import { useTasks } from "@/hooks/tasks";
import { useSession } from "next-auth/react";
import React from "react";
import ProgressBar from "../progress-bar";
/**
 * Component that renders the summary panel of the dashboard page.
 *
 * The panel presents a summary of the user's progress, with the percentage of
 * goal completion.
 *
 * @returns {JSX.Element}
 */

export default function Overview(): JSX.Element {
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [completedTasks, setCompletedTasks] = React.useState(0);

  const { countTasks } = useTasks();
  const { data } = useSession()
  
   React.useEffect(() => {
    async function fetchTasks() {
      const allTasks = await countTasks({
        where: {
          author: {
            id: data?.user?.id,
          },
        },
      });

      const finishedTasks = await countTasks({
        where: {
          author: {
            id: data?.user?.id,
          },
          isDone: true,
        },
      });

      setTotalTasks(allTasks);
      setCompletedTasks(finishedTasks);
    }

    fetchTasks();
  }, [data?.user?.id]);

  return (
    <div className="p-6">
      <ProgressBar totalTasks={totalTasks} completedTasks={completedTasks} />
    </div>
  );
}
