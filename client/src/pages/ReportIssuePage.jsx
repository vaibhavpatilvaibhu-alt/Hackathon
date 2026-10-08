import React, { useState } from 'react';
import { useReports } from '../context/ReportsContext';
import { analyzeIssueWithAI } from '../services/api';
import {
  Sparkles,
  MapPin,
  Camera,
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
  Building,
  Sliders,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Info
} from 'lucide-react';

export default function ReportIssuePage() {
  const { addReport, setActiveTab, addToast } = useReports();

  // Form State
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [optionalCategory, setOptionalCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Submission State
  const [submittedReport, setSubmittedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Preset Prompts
  const quickPresets = [
    {
      title: 'Staircase Lighting',
      text: 'The staircase light near Block C has been broken for three days and it is very dark at night.',
      loc: 'Block C - Staircase 2nd Floor'
    },
    {
      title: 'Blocked Wheelchair Ramp',
      text: 'The wheelchair ramp at the Library north entrance is blocked by heavy wooden shipping pallets.',
      loc: 'Central Library - North Ramp'
    },
    {
      title: 'Projector HDMI Sparking',
      text: 'The projector in Science Hall 302 won\'t turn on and the HDMI cable sparks when connected.',
      loc: 'Science Complex - Room 302'
    },
    {
      title: 'Urgent Restroom Leak',
      text: 'A burst pipe is flooding water onto the floor in the 1st floor restroom of Engineering Wing B.',
      loc: 'Engineering Wing B - 1st Floor Restroom'
    }
  ];

  // Quick Locations
  const quickLocations = [
    'Block C - Staircase',
    'Central Library - North Ramp',
    'Science Complex - Hall 302',
    'Engineering Wing B',
    'Student Center - Main Plaza',
    'Campus Dining Commons'
  ];

  // Handle Preset Fill
  const handleSelectPreset = (preset) => {
    setDescription(preset.text);
    setLocation(preset.loc);
    setAiResult(null);
  };

  // Handle Image Upload Simulation
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze with AI
  const handleAnalyzeWithAI = async () => {
    if (!description.trim()) {
      addToast('Input Required', 'Please enter a description of the campus issue.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const result = await analyzeIssueWithAI(description.trim(), location.trim());
      setAiResult({
        category: optionalCategory || result.category,
        priority: result.priority,
        department: result.department,
        summary: result.summary,
        recommendedAction: result.recommendedAction,
        confidence: result.confidence,
        source: result.source,
        model: result.model
      });
      addToast('AI Analysis Complete', `Classified as ${result.category} with ${result.confidence}% confidence`, 'info');
    } catch (err) {
      console.error('Analysis failed:', err);
      addToast('Analysis Error', 'Failed to analyze with AI. Check backend connection.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Final Report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      addToast('Description Missing', 'Please describe the problem.', 'warning');
      return;
    }

    if (!location.trim()) {
      addToast('Location Missing', 'Please specify where this issue is located on campus.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const reportPayload = {
      description: description.trim(),
      location: location.trim(),
      category: aiResult?.category || optionalCategory || 'Other',
      priority: aiResult?.priority || 'Medium',
      department: aiResult?.department || 'General Campus Operations',
      summary: aiResult?.summary || description.slice(0, 50),
      recommendedAction: aiResult?.recommendedAction || 'Inspect and address reported issue.',
      confidence: aiResult?.confidence || 92,
      imageUrl: imagePreview,
      source: aiResult?.source || 'manual',
      model: aiResult?.model || 'CampusGuardian Engine'
    };

    try {
      const created = await addReport(reportPayload);
      setSubmittedReport(created);
    } catch (err) {
      console.error('Submission failed:', err);
      addToast('Error', 'Failed to record report. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to file another report
  const handleResetForm = () => {
    setDescription('');
    setLocation('');
    setOptionalCategory('');
    setImagePreview(null);
    setAiResult(null);
    setSubmittedReport(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Incident Triage</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Report a Campus Issue</h1>
        <p className="text-sm text-slate-400 mt-1">
          Describe what you see in natural language. Our AI engine will categorize, determine urgency, and recommend routing.
        </p>
      </div>

      {/* Quick Test Presets Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Quick-Fill Test Scenarios:</span>
          <span className="text-[11px] text-blue-400">Click to autofill sample incident</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left transition text-xs"
            >
              <p className="font-semibold text-white truncate">{preset.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{preset.loc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Reporting Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Natural Language Issue Description <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The staircase light near Block C has been broken for three days and it is very dark at night..."
              className="w-full rounded-2xl p-4 text-sm text-white glass-input placeholder:text-slate-500 resize-none leading-relaxed"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Provide as much context as you like. You do not need to choose a code or department manually.
          </p>
        </div>

        {/* Location & Optional Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Campus Location <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block C - Staircase 2nd Floor"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white glass-input placeholder:text-slate-500"
              />
            </div>

            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickLocations.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Optional Category Suggestion
            </label>
            <select
              value={optionalCategory}
              onChange={(e) => {
                setOptionalCategory(e.target.value);
                if (aiResult) setAiResult({ ...aiResult, category: e.target.value });
              }}
              className="w-full rounded-xl px-4 py-3 text-sm text-white glass-input bg-navy-900"
            >
              <option value="">Auto-Detect with AI (Recommended)</option>
              <option value="Safety">Safety</option>
              <option value="Maintenance">Maintenance</option>
              <option value="IT/Cybersecurity">IT / Cybersecurity</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Lost & Found">Lost & Found</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-[11px] text-slate-400">
              Leave on Auto-Detect to allow AI to classify based on your description.
            </p>
          </div>
        </div>

        {/* Optional Image Upload UI */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Optional Photo Evidence
          </label>
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 text-center transition">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Incident Preview"
                  className="max-h-48 rounded-xl object-cover border border-slate-700 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full text-xs hover:bg-rose-500 shadow"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                <Camera className="w-8 h-8 text-blue-400/80" />
                <span className="text-xs text-slate-300 font-medium">
                  Click to browse photo or drag & drop image
                </span>
                <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Action: Analyze with AI Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            disabled={isAnalyzing || !description.trim()}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
              isAnalyzing
                ? 'bg-indigo-700 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-glow-blue active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI Analyzing Urgency, Department & Actions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Analyze with AI</span>
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Result Section (Editable before submission) */}
        {aiResult && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900/95 to-slate-900 border-2 border-blue-500/40 shadow-glow-blue space-y-6 animate-in slide-in-from-bottom duration-300">
            {/* Header / Engine Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Incident Classification</h3>
                  <p className="text-xs text-slate-400">
                    Engine: <span className="text-blue-300 font-semibold">{aiResult.model || 'Gemini 2.0 Flash'}</span>
                  </p>
                </div>
              </div>

              {/* Confidence Score Gauge */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Confidence:</span>
                <span className="text-sm font-bold text-emerald-400">{aiResult.confidence}%</span>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${aiResult.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Category */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category (Editable)</label>
                <select
                  value={aiResult.category}
                  onChange={(e) => setAiResult({ ...aiResult, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
                >
                  <option value="Safety">Safety</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="IT/Cybersecurity">IT/Cybersecurity</option>
                  <option value="Accessibility">Accessibility</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Priority (Editable)</label>
                <select
                  value={aiResult.priority}
                  onChange={(e) => setAiResult({ ...aiResult, priority: e.target.value })}
                  className={`w-full p-2.5 rounded-xl bg-slate-950 border font-semibold ${
                    aiResult.priority === 'Critical'
                      ? 'border-rose-500 text-rose-400'
                      : aiResult.priority === 'High'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-blue-500 text-blue-400'
                  }`}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department (Editable)</label>
                <input
                  type="text"
                  value={aiResult.department}
                  onChange={(e) => setAiResult({ ...aiResult, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium truncate"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-400 font-semibold">Short Summary (Editable)</label>
              <input
                type="text"
                value={aiResult.summary}
                onChange={(e) => setAiResult({ ...aiResult, summary: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-sm"
              />
            </div>

            {/* Recommended Action */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-400 font-semibold">Recommended Action (Editable)</label>
              <textarea
                rows={2}
                value={aiResult.recommendedAction}
                onChange={(e) => setAiResult({ ...aiResult, recommendedAction: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-blue-200 text-xs leading-relaxed"
              />
            </div>

            {/* Submit Report Final Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-glow-emerald transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Report & Notifying Ops...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Confirm & Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Success Confirmation Modal */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-navy-900 border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-glow-emerald space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Report Successfully Submitted!</h2>
              <p className="text-xs text-slate-300">
                Your incident has been logged, triaged, and dispatched to university operations.
              </p>
            </div>

            {/* Tracking Receipt Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Tracking Report ID</span>
                <span className="font-mono text-base font-bold text-blue-400">{submittedReport.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  {submittedReport.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category & Priority</span>
                <span className="font-semibold text-white">
                  {submittedReport.category} • {submittedReport.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Department</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {submittedReport.department}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Summary:</span> {submittedReport.summary}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedReport(null);
                  setActiveTab('my-reports');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-blue transition flex items-center justify-center gap-2"
              >
                <span>Track Report in "My Reports"</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedReport(null);
                    setActiveTab('admin');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                >
                  View in Admin Hub
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                >
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
