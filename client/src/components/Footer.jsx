import React from 'react';
import { useReports } from '../context/ReportsContext';
import { Shield, Heart, Sparkles, RefreshCw, AlertCircle, Phone } from 'lucide-react';

export default function Footer() {
  const { setActiveTab, resetDemoReports } = useReports();

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-navy-950/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">CampusGuardian AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              "A Safer. Smarter. More Accessible Campus."
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-blue-400">
              <Sparkles className="w-3 h-3" />
              <span>Smart Campus Solutions Track</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-blue-400 transition">
                  Report Campus Issue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-reports')} className="hover:text-blue-400 transition">
                  Track My Reports
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assistant')} className="hover:text-blue-400 transition">
                  24/7 AI Campus Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-blue-400 transition">
                  Admin Triage Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Inclusion */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Safety & Accessibility</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('emergency')} className="hover:text-rose-400 transition flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-rose-500" />
                  <span>Campus Emergency Contacts</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('accessibility')} className="hover:text-blue-400 transition">
                  Accessible Facilities Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('accessibility')} className="hover:text-blue-400 transition">
                  Mobility Escort Requests
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('settings')} className="hover:text-blue-400 transition">
                  High-Contrast & Accessibility Modes
                </button>
              </li>
            </ul>
          </div>

          {/* System Control */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Demo Configuration</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Running live prototype with realistic sample campus telemetry and dual AI routing.
            </p>
            <button
              onClick={resetDemoReports}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Reset Demo Reports</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="flex items-center gap-1">
            <span>Built for Smart Campus Solutions Hackathon • CampusGuardian AI</span>
          </p>
          <p className="text-center sm:text-right">
            Note: Fictional university telemetry for hackathon evaluation. For genuine emergency dial 911 / 112.
          </p>
        </div>
      </div>
    </footer>
  );
}
