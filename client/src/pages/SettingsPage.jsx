import React from 'react';
import { useReports } from '../context/ReportsContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sun,
  Moon,
  Contrast,
  Type,
  Shield,
  Sparkles,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function SettingsPage() {
  const {
    userRole,
    setUserRole,
    systemHealth,
    resetDemoReports,
    accessibilitySettings,
    updateAccessibilitySettings,
    addToast
  } = useReports();

  const handleNotificationToggle = (key) => {
    updateAccessibilitySettings({
      notifications: {
        ...accessibilitySettings.notifications,
        [key]: !accessibilitySettings.notifications[key]
      }
    });
    addToast('Preferences Updated', 'Notification settings saved.', 'info');
  };

  const isGemini = systemHealth?.aiEngine?.geminiConfigured;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Application Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">System & Accessibility Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your persona, notification triggers, display accessibility options, and view AI runtime diagnostics.
        </p>
      </div>

      {/* 1. User Profile Section */}
      <div className="p-6 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">User Profile & Access Role</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-glow-blue">
              VP
            </div>
            <div>
              <p className="font-bold text-white text-base">Vaibhav Patil</p>
              <p className="text-xs text-slate-400">vaibhav.p@campus.aegis.edu • ID: #24SUUBEAML673</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Department of Computer Engineering
              </span>
            </div>
          </div>

          <div className="space-y-1 self-stretch sm:self-auto">
            <label className="text-xs text-slate-400 font-semibold block">Active Role Mode:</label>
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => {
                  setUserRole('student');
                  addToast('Role Switched', 'Active persona changed to Student', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  userRole === 'student' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  addToast('Role Switched', 'Active persona changed to Administrator', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  userRole === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Accessibility Preferences */}
      <div className="p-6 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Contrast className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white">Accessibility & Display Controls</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">High Contrast Mode</p>
              <p className="text-xs text-slate-400">Deep pitch borders and stark text contrast for visual clarity</p>
            </div>
            <button
              onClick={() => {
                updateAccessibilitySettings({ highContrast: !accessibilitySettings.highContrast });
                addToast('Display Updated', `High contrast ${!accessibilitySettings.highContrast ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                accessibilitySettings.highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 gap-2">
            <div>
              <p className="font-semibold text-white">Interface Typography Scaling</p>
              <p className="text-xs text-slate-400">Increase reading comfort across dashboards and forms</p>
            </div>
            <div className="flex gap-1.5">
              {['normal', 'large', 'xl'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateAccessibilitySettings({ fontSize: size })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition ${
                    accessibilitySettings.fontSize === size
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">Reduced Motion</p>
              <p className="text-xs text-slate-400">Suppress subtle background pulses and sliding transitions</p>
            </div>
            <button
              onClick={() => updateAccessibilitySettings({ reducedMotion: !accessibilitySettings.reducedMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                accessibilitySettings.reducedMotion ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Alerts & Notification Triggers</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          {[
            { key: 'email', label: 'Email Incident Status Updates', desc: 'Receive emails when your report is assigned or resolved' },
            { key: 'sms', label: 'SMS Emergency Broadcasts', desc: 'Real-time text alerts for campus weather, evacuations, and security drills' },
            { key: 'push', label: 'Browser Push Notifications', desc: 'Instant desktop pings when campus work crews respond to reports' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleNotificationToggle(key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  accessibilitySettings.notifications?.[key] ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI Engine & System Runtime Diagnostics */}
      <div className="p-6 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">AI Engine & Backend Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold">Active AI Engine</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{isGemini ? 'Google Gemini 2.0 Flash' : 'CampusGuardian Local Fallback RuleEngine'}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {isGemini ? 'Connected via secure server proxy' : 'Offline-ready keyword & heuristic classifier active'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold">Backend Server Status</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Online & Synced (Express on :5000)</span>
            </p>
            <p className="text-[11px] text-slate-400">
              LocalStorage + Express dual persistence enabled
            </p>
          </div>
        </div>

        {/* Reset Demo Button */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-white">Reset Demo Reports</p>
            <p className="text-[11px] text-slate-400">Restore the initial campus dataset for evaluation demo</p>
          </div>
          <button
            onClick={resetDemoReports}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-blue-300 font-semibold border border-slate-700 transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
