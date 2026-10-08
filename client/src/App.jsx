import React from 'react';
import { useReports } from './context/ReportsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Pages
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import ReportIssuePage from './pages/ReportIssuePage';
import MyReportsPage from './pages/MyReportsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyCenter from './pages/EmergencyCenter';
import AccessibilityCenter from './pages/AccessibilityCenter';
import SettingsPage from './pages/SettingsPage';

function MainContent() {
  const { activeTab } = useReports();

  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'report':
        return <ReportIssuePage />;
      case 'my-reports':
        return <MyReportsPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'emergency':
        return <EmergencyCenter />;
      case 'accessibility':
        return <AccessibilityCenter />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {renderPage()}
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar />
        <MainContent />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
