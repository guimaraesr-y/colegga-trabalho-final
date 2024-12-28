"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BsCalendar, BsGraphUp, BsListTask } from "react-icons/bs";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SignOutButton from "@/components/signout-button";

const localizer = momentLocalizer(moment);

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("progresso");
  const [events, setEvents] = useState([
    { title: "Reunião com o grupo de estudos", start: new Date(2024, 11, 28, 14, 0), end: new Date(2024, 11, 28, 15, 0) },
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [tasks, setTasks] = useState(["Estudar capítulo 5", "Revisar notas de aula", "Participar do fórum de discussão"]);
  const [newTask, setNewTask] = useState("");

  const tabs = [
    { id: "progresso", label: "Progresso", icon: <BsGraphUp className="text-2xl" /> },
    { id: "tarefas", label: "Tarefas Recentes", icon: <BsListTask className="text-2xl" /> },
    { id: "calendario", label: "Calendário", icon: <BsCalendar className="text-2xl" /> },
  ];

  const handleAddEvent = () => {
    setEvents([...events, { ...newEvent, start: new Date(newEvent.start), end: new Date(newEvent.end) }]);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "progresso":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Seu Progresso</h2>
            <p className="text-gray-600">Você completou 75% dos seus objetivos!</p>
          </div>
        );
      case "tarefas":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tarefas Recentes</h2>
            <ul className="list-disc ml-6 text-gray-600 mb-4">
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Nova tarefa"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">Adicionar</Button>
            </div>
          </div>
        );
      case "calendario":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Calendário</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Título do evento"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="datetime-local"
                placeholder="Início"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="datetime-local"
                placeholder="Fim"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                className="border p-2 rounded mb-2 w-full"
              />
              <Button onClick={handleAddEvent} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">Adicionar Evento</Button>
            </div>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          {/* <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Logout
          </Button> */}
          <SignOutButton>Sair</SignOutButton>
        </div>

        {/* User Info */}
        {/* <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md text-gray-700">
          <h3 className="text-lg font-bold">Informações do Usuário</h3>
          <p><strong>Nome:</strong> João Silva</p>
          <p><strong>Email:</strong> joao.silva@example.com</p>
        </div> */}

        {/* Tabs Navigation */}
        <div className="flex space-x-6 border-b border-gray-200 pb-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-300 ${
                selectedTab === tab.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
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
