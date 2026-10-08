import React, { useState } from 'react';
import { useReports } from '../context/ReportsContext';
import {
  Shield,
  LayoutDashboard,
  AlertCircle,
  FileText,
  Bot,
  SlidersHorizontal,
  Accessibility,
  Settings,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';
import EmergencyModal from './EmergencyModal';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    systemHealth,
    reports
  } = useReports();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const pendingCount = reports.filter(r => r.status !== 'Resolved').length;

  const navItems = [
    { id: 'landing', label: 'Home', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report Issue', icon: AlertCircle, highlight: true },
    { id: 'my-reports', label: 'My Reports', icon: FileText, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, ai: true },
    { id: 'admin', label: 'Admin Hub', icon: SlidersHorizontal },
    { id: 'emergency', label: 'Emergency', icon: PhoneCall, urgent: true },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const isGemini = systemHealth?.aiEngine?.geminiConfigured;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-navy-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        {/* Top Mini Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border-b border-slate-800/60 px-4 py-1 text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">CampusGuardian AI</span>
            <span className="hidden sm:inline text-slate-400">— "A Safer. Smarter. More Accessible Campus."</span>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isGemini
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>{isGemini ? 'Gemini 2.0 AI Online' : 'Local AI Engine Active'}</span>
            </div>

            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <span className="text-slate-400 pl-1.5 hidden md:inline">Role:</span>
              <button
                onClick={() => setUserRole('student')}
                className={`px-2 py-0.5 rounded transition ${
                  userRole === 'student'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2 py-0.5 rounded transition ${
                  userRole === 'admin'
                    ? 'bg-purple-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-navy-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  CampusGuardian
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium tracking-wide">
                Smart Campus Safety & Operations
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                      : item.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue'
                      : item.urgent
                      ? 'text-rose-300 hover:bg-rose-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.ai ? 'text-indigo-400' : item.urgent ? 'text-rose-400' : ''}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Emergency Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border border-rose-400/30 shadow-glow-rose transition active:scale-95 animate-pulse"
              title="Open Emergency SOS"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">EMERGENCY SOS</span>
              <span className="sm:hidden">SOS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-navy-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between px-2">
              <span className="text-xs text-slate-400">Current Role Mode:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserRole('student')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    userRole === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserRole('admin')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    userRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </>
  );
}
