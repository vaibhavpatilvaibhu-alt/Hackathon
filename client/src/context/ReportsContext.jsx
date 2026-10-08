import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REPORTS } from '../data/initialReports';
import {
  fetchServerReports,
  postServerReport,
  patchServerReport,
  checkBackendHealth
} from '../services/api';

const ReportsContext = createContext(null);
const STORAGE_KEY = 'campusguardian_reports_v1';
const SETTINGS_KEY = 'campusguardian_settings_v1';

export function ReportsProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTabState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'landing';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash changes with browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Reports state initialized from localStorage with fallback to INITIAL_REPORTS
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load reports from localStorage:', e);
    }
    return INITIAL_REPORTS;
  });

  // User Role
  const [userRole, setUserRole] = useState('student'); // 'student' | 'admin' | 'staff'

  // System & AI Engine health status
  const [systemHealth, setSystemHealth] = useState({
    status: 'checking',
    aiEngine: { activeModel: 'Initializing...' }
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Accessibility & Preferences
  const [accessibilitySettings, setAccessibilitySettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      highContrast: false,
      fontSize: 'normal', // 'normal' | 'large' | 'xl'
      reducedMotion: false,
      soundCues: false,
      notifications: {
        email: true,
        sms: true,
        push: true,
        criticalOnly: false
      }
    };
  });

  // Save settings
  const updateAccessibilitySettings = (newSettings) => {
    setAccessibilitySettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to persist reports to localStorage:', e);
    }
  }, [reports]);

  // Initial backend health check & sync
  useEffect(() => {
    let isMounted = true;
    async function initSync() {
      const health = await checkBackendHealth();
      if (isMounted) setSystemHealth(health);

      // Try fetching reports from backend if available
      const serverReports = await fetchServerReports();
      if (isMounted && serverReports && serverReports.length > 0) {
        // Merge or use server reports if user hasn't already modified local store
        setReports(prev => {
          const ids = new Set(prev.map(r => r.id));
          const newFromBackend = serverReports.filter(r => !ids.has(r.id));
          return [...prev, ...newFromBackend];
        });
      }
    }
    initSync();
    return () => { isMounted = false; };
  }, []);

  // Add new report
  const addReport = async (reportData) => {
    const id = `CG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newReport = {
      id,
      createdAt: now,
      description: reportData.description,
      location: reportData.location,
      category: reportData.category || 'Other',
      priority: reportData.priority || 'Medium',
      department: reportData.department || 'General Campus Operations',
      summary: reportData.summary || reportData.description.slice(0, 50),
      recommendedAction: reportData.recommendedAction || 'Inspect and address reported issue.',
      confidence: reportData.confidence || 92,
      status: 'Submitted',
      imageUrl: reportData.imageUrl || null,
      reporter: userRole === 'admin' ? 'Administrator' : 'Student (Logged in user)',
      assignedStaff: 'Pending Triage',
      source: reportData.source || 'ai',
      model: reportData.model || 'CampusGuardian Engine',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Report logged via CampusGuardian AI' }
      ]
    };

    // Update local state and localStorage immediately
    setReports(prev => [newReport, ...prev]);

    // Async sync to server
    postServerReport(newReport).catch(e => console.warn('Background sync failed:', e));

    addToast('Report Submitted Successfully', `Tracking ID: ${newReport.id}`, 'success');
    return newReport;
  };

  // Update existing report (e.g. from Admin Dashboard)
  const updateReport = async (id, updates) => {
    const now = new Date().toISOString();

    setReports(prev => prev.map(report => {
      if (report.id !== id) return report;

      const newTimeline = [...report.timeline];
      if (updates.status && updates.status !== report.status) {
        newTimeline.push({
          status: updates.status,
          timestamp: now,
          note: updates.note || `Status updated to ${updates.status} by ${userRole}`
        });
      }

      return {
        ...report,
        ...updates,
        timeline: newTimeline
      };
    }));

    // Async sync to server
    patchServerReport(id, updates).catch(e => console.warn('Background update sync failed:', e));

    addToast('Report Updated', `Report ${id} updated to ${updates.status || 'new values'}`, 'info');
  };

  // Reset to original demo reports
  const resetDemoReports = () => {
    setReports(INITIAL_REPORTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    addToast('Demo Data Reset', 'Realistic sample campus reports restored.', 'info');
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      updateReport,
      resetDemoReports,
      activeTab,
      setActiveTab,
      userRole,
      setUserRole,
      systemHealth,
      toasts,
      addToast,
      removeToast,
      accessibilitySettings,
      updateAccessibilitySettings
    }}>
      <div className={`min-h-screen ${accessibilitySettings.highContrast ? 'high-contrast' : ''} ${
        accessibilitySettings.fontSize === 'large' ? 'text-lg' : accessibilitySettings.fontSize === 'xl' ? 'text-xl' : 'text-base'
      }`}>
        {children}
      </div>
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports must be used within a ReportsProvider');
  return context;
}
