"use client";

import { useState } from "react";
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

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const { } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const [selectedTab, setSelectedTab] = useState<string>("overview")
  const [tasks, setTasks] = useState<string[]>(["Estudar capítulo 5", "Revisar notas de aula", "Participar do fórum de discussão"]);
  const [newTask, setNewTask] = useState<string>("");

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: <BsGraphUp className="text-2xl" /> },
    { id: "tasks", label: "Metas", icon: <BsListTask className="text-2xl" /> },
    { id: "calendar", label: "Calendário", icon: <BsCalendar className="text-2xl" /> },
  ];

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
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
