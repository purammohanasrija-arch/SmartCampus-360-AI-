import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  BookOpen, 
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Faculty } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

export function FacultyDirectory() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const res = await apiClient.getFaculty();
      setFacultyList(res.faculty);
    } catch (err) {
      console.error(err);
    }
  };

  const departments = ['All', 'Computer Science & AI', 'Electronics & Quantum Communications', 'Mechanical & Autonomous Robotics'];

  const filtered = facultyList.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.facultyId.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Faculty</span>
            <span aria-hidden="true">·</span>
            <span>Academic Chairs & Faculty Fellows</span>
            <span aria-hidden="true">·</span>
            <span>Workload Allocation</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Faculty & Department Directory</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Profiles of professors, researchers, subject chairs, laboratory directors, and faculty office hours.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search faculty by name, ID, or research specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dept === 'All' ? 'All Departments' : dept.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(fac => (
          <div
            key={fac.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
                {fac.avatar}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{fac.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
                    {fac.facultyId}
                  </span>
                </div>
                <p className="text-xs text-purple-300 font-medium">{fac.designation}</p>
                <p className="text-xs text-slate-400">{fac.department}</p>
              </div>
            </div>

            {/* Courses Handled */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <span className="text-slate-400 font-semibold block flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Active Subjects Handled:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fac.coursesHandled.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact & Office details */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{fac.roomNo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{fac.workloadHours}h / week</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{fac.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{fac.officeHours.split(' ')[0]} {fac.officeHours.split(' ')[1]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
