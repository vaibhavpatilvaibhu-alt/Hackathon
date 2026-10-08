import React, { useState } from 'react';
import { useReports } from '../context/ReportsContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  Sliders,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Check,
  Building,
  RefreshCw,
  Eye,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboard() {
  const { reports, updateReport, addToast } = useReports();

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  // Computed metrics
  const totalReports = reports.length;
  const criticalReports = reports.filter(r => r.priority === 'Critical').length;
  const pendingReports = reports.filter(r => r.status !== 'Resolved').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const resolutionPercentage = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  // Chart 1: Category Distribution
  const categoryCounts = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  // Chart 2: Priority Distribution
  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const priorityColors = {
    Critical: '#EF4444',
    High: '#F59E0B',
    Medium: '#3B82F6',
    Low: '#64748B'
  };

  const priorityChartData = priorityOrder.map(p => ({
    name: p,
    value: reports.filter(r => r.priority === p).length
  })).filter(item => item.value > 0);

  // Filtered reports for the table
  const filteredReports = reports.filter(r => {
    const matchSearch =
      search === '' ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || r.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const departmentOptions = [
    'Facilities Management & Maintenance',
    'Campus Security & Safety Operations',
    'Disability & Accessibility Infrastructure',
    'Campus IT & Audiovisual Infrastructure',
    'Student Affairs & Property Custody',
    'Campus Environmental & Custodial Services',
    'General Campus Operations'
  ];

  const handleStatusChange = (id, newStatus) => {
    updateReport(id, { status: newStatus });
  };

  const handleDepartmentChange = (id, newDept) => {
    updateReport(id, { department: newDept });
  };

  const handleQuickResolve = (id) => {
    updateReport(id, { status: 'Resolved' });
    addToast('Report Resolved', `Report ${id} has been marked as Resolved.`, 'success');
  };

  const exportSummaryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campusguardian-reports-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Export Generated', 'Report database downloaded as JSON', 'info');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Administrator Triage Hub</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispatch authority for campus operations, department assignments, and resolution tracking.
          </p>
        </div>

        <button
          onClick={exportSummaryJSON}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-semibold border border-slate-700 transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Reports JSON</span>
        </button>
      </div>

      {/* 5 Top Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl glass-panel">
          <span className="text-xs text-slate-400">Total Reports</span>
          <p className="text-2xl font-bold text-white mt-1">{totalReports}</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <span className="text-xs text-rose-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Critical Reports
          </span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{criticalReports}</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Actions
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendingReports}</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Resolved
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{resolvedReports}</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel col-span-2 sm:col-span-1">
          <span className="text-xs text-cyan-400">Resolution Rate</span>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{resolutionPercentage}%</p>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">Category Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="p-5 sm:p-6 rounded-3xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">Priority Severity Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={priorityColors[entry.name] || '#3B82F6'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incident Management Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Manage & Dispatch Incidents</h2>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search report..."
                className="pl-8 pr-3 py-1.5 text-xs text-white glass-input rounded-xl placeholder:text-slate-500 w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs text-white glass-input rounded-xl bg-navy-900"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs text-white glass-input rounded-xl bg-navy-900"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Issue & Location</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/40 transition">
                  {/* ID */}
                  <td className="p-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                    {report.id}
                  </td>

                  {/* Summary & Location */}
                  <td className="p-3.5 max-w-xs">
                    <p className="font-semibold text-white truncate">{report.summary || report.description}</p>
                    <p className="text-[11px] text-slate-400 truncate">{report.location}</p>
                  </td>

                  {/* Priority */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${
                        report.priority === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : report.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </td>

                  {/* Department (Editable dropdown) */}
                  <td className="p-3.5 max-w-xs">
                    <select
                      value={report.department}
                      onChange={(e) => handleDepartmentChange(report.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-1.5 focus:border-blue-500 focus:outline-none"
                    >
                      {departmentOptions.map((dept, i) => (
                        <option key={i} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3.5 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : report.status === 'In Progress'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                          : report.status === 'Assigned'
                          ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                          : report.status === 'Under Review'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                    {report.status !== 'Resolved' && (
                      <button
                        onClick={() => handleQuickResolve(report.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-semibold transition"
                        title="Mark as Resolved"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Full Inspector Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">{selectedReport.id}</span>
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
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400">Reporter & Time:</span>
                <p className="text-white font-medium mt-0.5">
                  {selectedReport.reporter || 'Student'} • {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400">Full Incident Description:</span>
                <p className="text-slate-200 mt-1 leading-relaxed">"{selectedReport.description}"</p>
              </div>

              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20">
                <span className="text-blue-300">Recommended Action:</span>
                <p className="text-blue-200 mt-1 leading-relaxed">{selectedReport.recommendedAction}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-400">Quick Status Update:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReport.id, 'In Progress');
                      setSelectedReport({ ...selectedReport, status: 'In Progress' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReport.id, 'Resolved');
                      setSelectedReport({ ...selectedReport, status: 'Resolved' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold transition"
                  >
                    Mark Resolved
                  </button>
                </div>
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
