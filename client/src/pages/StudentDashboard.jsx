import React, { useState } from 'react';
import { useReports } from '../context/ReportsContext';
import { CAMPUS_ANNOUNCEMENTS } from '../data/initialReports';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Bot,
  PhoneCall,
  Accessibility,
  ArrowRight,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Eye,
  Megaphone
} from 'lucide-react';

export default function StudentDashboard() {
  const { reports, setActiveTab } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);

  // Computed metrics
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status !== 'Resolved').length;
  const criticalReports = reports.filter(r => r.priority === 'Critical').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;

  const recentReports = reports.slice(0, 5);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Assigned':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'Under Review':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950/60 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Aegis Campus Safety Status: Normal Active Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Incident Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track reported campus infrastructure repairs, safety observations, and accessibility requests in real-time.
          </p>
        </div>

        {/* Quick New Report Action */}
        <button
          onClick={() => setActiveTab('report')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-glow-blue transition active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Campus Issue</span>
        </button>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Reports</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalReports}</p>
          <p className="text-[11px] text-slate-400 mt-1">Campus wide records</p>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Pending Actions</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-400">{pendingReports}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under review & dispatch</p>
        </div>

        {/* Critical */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Critical Priority</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-400">{criticalReports}</p>
          <p className="text-[11px] text-rose-300 mt-1">Urgent response queued</p>
        </div>

        {/* Resolved */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{resolvedReports}</p>
          <p className="text-[11px] text-emerald-300 mt-1">Successfully addressed</p>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('report')}
            className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition group"
          >
            <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-400 mb-2 group-hover:scale-105 transition">
              <PlusCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Report An Issue</p>
            <p className="text-[11px] text-slate-400">AI auto-triage & dispatch</p>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition group"
          >
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 mb-2 group-hover:scale-105 transition">
              <Bot className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Ask AI Assistant</p>
            <p className="text-[11px] text-slate-400">Campus knowledge base</p>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition group"
          >
            <div className="p-2 w-fit rounded-lg bg-rose-500/10 text-rose-400 mb-2 group-hover:scale-105 transition">
              <PhoneCall className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Emergency Center</p>
            <p className="text-[11px] text-slate-400">24/7 Security & Hotlines</p>
          </button>

          <button
            onClick={() => setActiveTab('accessibility')}
            className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition group"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-105 transition">
              <Accessibility className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Accessibility Center</p>
            <p className="text-[11px] text-slate-400">Ramps, lifts & escorts</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Reports Feed & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Recent Campus Reports</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                {reports.length} total
              </span>
            </h2>
            <button
              onClick={() => setActiveTab('my-reports')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View All Reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-4 rounded-2xl glass-panel-interactive cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{report.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getPriorityBadge(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {report.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                    {report.summary || report.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{report.location}</span>
                    <span>•</span>
                    <span>{report.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-blue-400 font-medium hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Announcements (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-400" />
              <span>Campus Alerts & News</span>
            </h2>
          </div>

          <div className="space-y-3">
            {CAMPUS_ANNOUNCEMENTS.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl glass-panel space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.content}</p>
              </div>
            ))}

            {/* Safety Reminder Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-xs">
              <p className="font-semibold text-indigo-300 mb-1">Night Safety Note</p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Campus security patrols are stationed at Blue Light callboxes every 200m. Request an escort at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Report Modal Inspector */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">{selectedReport.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedReport.summary}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Full Incident Description:</span>
                <p className="text-slate-200 mt-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  "{selectedReport.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Location</span>
                  <p className="font-semibold text-white mt-0.5">{selectedReport.location}</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Assigned Department</span>
                  <p className="font-semibold text-white mt-0.5">{selectedReport.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Priority & Confidence</span>
                  <p className="font-semibold text-white mt-0.5">
                    {selectedReport.priority} ({selectedReport.confidence || 94}% AI confidence)
                  </p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Current Status</span>
                  <p className="font-semibold text-cyan-400 mt-0.5">{selectedReport.status}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400">AI Recommended Action:</span>
                <p className="text-blue-300 mt-1 bg-blue-950/20 p-2.5 rounded-xl border border-blue-500/20">
                  {selectedReport.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
