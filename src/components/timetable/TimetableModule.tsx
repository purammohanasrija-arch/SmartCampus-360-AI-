import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TimetableSlot, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface TimetableModuleProps {
  currentUser: User;
}

const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

export function TimetableModule({ currentUser }: TimetableModuleProps) {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('All');

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const res = await apiClient.getTimetable();
      setTimetable(res.timetable);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSlots = selectedDay === 'All' 
    ? timetable 
    : timetable.filter(t => t.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Scheduling</span>
            <span aria-hidden="true">·</span>
            <span>Weekly Master Timetable</span>
            <span aria-hidden="true">·</span>
            <span>Collision Detection</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Master Class & Room Scheduler</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Synchronized course periods, lecture theatre room allocations, and faculty lab slots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day Filter Pills */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedDay('All')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedDay === 'All' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Days
            </button>
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedDay === d ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Calendar</span>
          </button>
        </div>
      </div>

      {/* Timetable Weekly Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlots.map(slot => (
          <div
            key={slot.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 transition-all shadow-md group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">{slot.courseCode}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                {slot.dayOfWeek}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                {slot.courseName}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{slot.facultyName}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>{slot.roomNo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
