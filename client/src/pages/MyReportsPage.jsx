import React, { useState } from 'react';
import { useReports } from '../context/ReportsContext';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Eye,
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function MyReportsPage() {
  const { reports, setActiveTab } = useReports();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Inspector Modal
  const [activeReport, setActiveReport] = useState(null);

  // Filter logic
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityStyle = (priority) => {
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

  const getStatusStyle = (status) => {
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

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Issue Registry</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and monitor the lifecycle of all student-submitted campus issues and work orders.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition self-start sm:self-auto"
        >
          + Submit New Report
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, location, details..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white glass-input placeholder:text-slate-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input bg-navy-900"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input bg-navy-900"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs text-white glass-input bg-navy-900"
            >
              <option value="All">All Categories</option>
              <option value="Safety">Safety</option>
              <option value="Maintenance">Maintenance</option>
              <option value="IT/Cybersecurity">IT/Cybersecurity</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Lost & Found">Lost & Found</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Active filter count & clear */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Showing <strong className="text-white">{filteredReports.length}</strong> of {reports.length} reports</span>
          {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All') && (
            <button
              onClick={resetAllFilters}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No reports match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or selecting "All" in the status/priority dropdowns.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setActiveReport(report)}
              className="p-5 rounded-2xl glass-panel-interactive cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: ID, Category, Badges, Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                    {report.id}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-md border font-semibold ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-md border font-semibold ${getStatusStyle(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                    {report.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {report.summary || report.description}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  "{report.description}"
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {report.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {report.department}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right Column: View Inspection Details */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-blue-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Timeline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Report Modal with Lifecycle Timeline */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Top */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-blue-400">{activeReport.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getPriorityStyle(activeReport.priority)}`}>
                    {activeReport.priority}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getStatusStyle(activeReport.status)}`}>
                    {activeReport.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{activeReport.summary}</h2>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 font-semibold">Reported Description</span>
                <p className="text-slate-200 mt-1 text-sm leading-relaxed">{activeReport.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Campus Location</span>
                  <p className="font-semibold text-white mt-0.5">{activeReport.location}</p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">Responsible Dept</span>
                  <p className="font-semibold text-white mt-0.5 truncate">{activeReport.department}</p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[11px]">AI Confidence</span>
                  <p className="font-semibold text-emerald-400 mt-0.5">{activeReport.confidence || 94}%</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20">
                <span className="text-blue-300 font-semibold">AI Recommended Action</span>
                <p className="text-blue-200 mt-1 leading-relaxed">{activeReport.recommendedAction}</p>
              </div>

              {/* Lifecycle Progress Bar & Timeline */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Resolution Progress Timeline
                </h4>

                <div className="space-y-2 border-l-2 border-slate-700 pl-4 ml-2">
                  {(activeReport.timeline || []).map((step, idx) => (
                    <div key={idx} className="relative pb-2">
                      <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-navy-900" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{step.status}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveReport(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
