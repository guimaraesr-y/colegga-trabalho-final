"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsCalendar, BsGraphUp, BsListTask } from "react-icons/bs";

import Header from "@/components/dashboard/header";
import TabNavigation, { Tab } from "@/components/dashboard/tab-navigation";
import CalendarTab from "@/components/dashboard/calendar-tab";
import TasksTab from "@/components/dashboard/task-tab";
import Overview from "@/components/dashboard/overview";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Task } from "@/domain/tasks/service";
import { useTasks } from "@/hooks/tasks";
import { toast } from "react-toastify";

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("overview")
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const { } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    }
  })
  const { getTasks, createTask } = useTasks();

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: <BsGraphUp className="text-2xl" /> },
    { id: "tasks", label: "Metas", icon: <BsListTask className="text-2xl" /> },
    { id: "calendar", label: "Calendário", icon: <BsCalendar className="text-2xl" /> },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks({});
        setTasks(fetchedTasks.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = () => 
    createTask({ content: newTask })
      .then((task) => {
        setTasks([
          ...tasks,
          task as Task,
        ]);
        setNewTask("");
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        toast.error("Ocorreu um erro ao criar sua tarefa. Tente novamente mais tarde.");
      })

  const handleAddTask = async () => {
    toast.promise(
      () => handleCreateTask(),
      {
        pending: 'Criando sua meta...',
        success: 'Sua tarefa foi criada com sucesso!',
      }
    )
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return <Overview />;
      case "tasks":
        return <TasksTab tasks={tasks} newTask={newTask} setNewTask={setNewTask} onAddTask={handleAddTask} />;
      case "calendar":
        return <CalendarTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />
        <TabNavigation tabs={tabs} selectedTab={selectedTab} onSelect={setSelectedTab} />
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
