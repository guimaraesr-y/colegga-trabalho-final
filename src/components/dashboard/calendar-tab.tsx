import moment from "moment";
import { Button } from "@/components/ui/button";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import { useState } from "react";

export type Event = {
  title: string;
  start: Date;
  end: Date;
};

export type NewEvent = {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

const localizer = momentLocalizer(moment);

export default function CalendarTab(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);

  const onAddEvent = () => {
    try {
      const startDateTime = new Date(`${newEvent.startDate}T${isAllDay ? "00:00" : newEvent.startTime}`);
      const endDateTime = hasEndDate
        ? new Date(`${newEvent.endDate || newEvent.startDate}T${isAllDay ? "23:59" : newEvent.endTime}`)
        : new Date(`${newEvent.startDate}T${isAllDay ? "00:00" : newEvent.endTime}`);

      if (!newEvent.title.trim()) {
        throw new Error("O título do evento é obrigatório.");
      }

      if (isNaN(startDateTime.getTime())) {
        throw new Error("Data e hora de início inválidas.");
      }

      if (isNaN(endDateTime.getTime())) {
        throw new Error("Data e hora de término inválidas.");
      }

      if (startDateTime > endDateTime) {
        throw new Error("A data de término não pode ser anterior à data de início.");
      }

      setEvents([...events, { title: newEvent.title, start: startDateTime, end: endDateTime }]);
      setNewEvent({ title: "", startDate: "", startTime: "", endDate: "", endTime: "" });
      setIsAllDay(false);
      setHasEndDate(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleNavigate = (newDate: Date, action: string) => {
    switch (action) {
      case "TODAY":
        setCurrentDate(new Date());
        break;
      case "PREV":
        setCurrentDate(moment(currentDate).subtract(1, view === "month" ? "months" : "weeks").toDate());
        break;
      case "NEXT":
        setCurrentDate(moment(currentDate).add(1, view === "month" ? "months" : "weeks").toDate());
        break;
      default:
        setCurrentDate(newDate);
    }
  };

  const isAllowedView = (view: View): view is "month" | "week" | "day" | "agenda" => {
    return ["month", "week", "day", "agenda"].includes(view);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Calendário</h2>
      <div className="mb-4 border p-4 rounded-lg bg-gray-100">
        <label className="block font-semibold text-gray-700 mb-2">Título do evento:</label>
        <input
          type="text"
          placeholder="Título do evento"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Data de início:</label>
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            className="border p-2 rounded w-full"
          />
          {!isAllDay && (
            <div className="flex gap-4 items-center">
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="border p-2 rounded w-full mt-2"
              />
              <span className="text-gray-500 mt-2">até</span>
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="border p-2 rounded w-full mt-2"
              />
            </div>
          )}
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={() => setIsAllDay(!isAllDay)}
            className="mr-2"
          />
          <label className="text-gray-700">Evento de dia inteiro</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            checked={hasEndDate}
            onChange={() => setHasEndDate(!hasEndDate)}
            className="mr-2"
          />
          <label className="text-gray-700">Adicionar data de término</label>
        </div>
        {hasEndDate && (
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Data de término:</label>
            <input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
            {!isAllDay && (
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="border p-2 rounded w-full mt-2"
              />
            )}
          </div>
        )}
        <Button onClick={onAddEvent} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg mt-4">
          Adicionar Evento
        </Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day", "agenda"]}
        view={view}
        onView={(newView) => {
          if (isAllowedView(newView)) {
            setView(newView);
          }
        }}
        date={currentDate}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
