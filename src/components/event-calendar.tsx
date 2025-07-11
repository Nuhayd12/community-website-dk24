"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  registrationLink?: string;
}

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const eventsByDay = events.reduce((acc: Record<string, Event[]>, event) => {
    const eventDate = new Date(event.date);
    if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
      const day = eventDate.getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(event);
    }
    return acc;
  }, {});

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium">
                {monthNames[month]} {year}
              </h3>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-xs font-medium text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-10 p-1 text-center text-sm",
                    day === null
                      ? "text-muted-foreground/30"
                      : "hover:bg-muted rounded-md",
                    eventsByDay[day as number] && "font-bold text-primary",
                  )}
                >
                  {day !== null && (
                    <div className="relative h-full flex items-center justify-center">
                      {day}
                      {eventsByDay[day] && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4" />
              Upcoming Events
            </h4>
            <ul className="overflow-hidden">
              {Object.entries(eventsByDay).flatMap(([, events]) => events)
                .length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground italic">
                  No events this month
                </li>
              ) : (
                Object.entries(eventsByDay)
                  .sort(([dayA], [dayB]) => Number(dayA) - Number(dayB))
                  .flatMap(([, events]) => events)
                  .map((event, index) => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    );

                    return (
                      <li key={index} className="px-3 py-2 text-sm">
                        <span className="font-medium text-foreground">
                          {formattedDate}
                        </span>
                        <span className="mx-2 text-muted-foreground">–</span>
                        <span className="text-muted-foreground">
                          {event.title}
                        </span>
                      </li>
                    );
                  })
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
