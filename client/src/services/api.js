/**
 * CampusGuardian AI - Frontend API Service Client
 * Features transparent offline resilience and fallback handling
 */

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend health check failed:', err.message);
  }
  return {
    status: 'offline_mode',
    service: 'CampusGuardian Client Storage',
    aiEngine: {
      geminiConfigured: false,
      fallbackEngineActive: true,
      activeModel: 'CampusGuardian Local Analyzer (Client Offline)'
    }
  };
}

export async function analyzeIssueWithAI(text, location = '') {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, location }),
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${res.status}`);
  } catch (err) {
    console.warn('Backend analyze call failed, falling back to client-side rule analyzer:', err.message);
    return clientFallbackAnalyze(text, location);
  }
}

export async function sendChatMessage(message, history = []) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend chat call failed, falling back to local campus responder:', err.message);
  }

  // Client-side quick responder
  return clientFallbackChat(message);
}

export async function fetchServerReports() {
  try {
    const res = await fetch(`${API_BASE}/reports`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch server reports:', err.message);
  }
  return null;
}

export async function postServerReport(reportData) {
  try {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to sync report to server:', err.message);
  }
  return null;
}

export async function patchServerReport(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to patch report on server:', err.message);
  }
  return null;
}

export async function fetchEmergencyData() {
  try {
    const res = await fetch(`${API_BASE}/emergency`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Emergency fetch error:', err.message);
  }
  return null;
}

export async function fetchAccessibilityData() {
  try {
    const res = await fetch(`${API_BASE}/accessibility`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Accessibility fetch error:', err.message);
  }
  return null;
}

// Client-side emergency fallback analyzer
function clientFallbackAnalyze(text = '', location = '') {
  const lower = (text + ' ' + location).toLowerCase();
  let category = 'Other';
  let priority = 'Medium';
  let department = 'Campus Operations';
  let confidence = 92;
  let summary = text.slice(0, 45);
  let recommendedAction = 'Investigate reported incident on site.';

  if (lower.includes('light') || lower.includes('dark') || lower.includes('security') || lower.includes('lock')) {
    category = 'Safety';
    priority = 'High';
    department = 'Maintenance & Campus Safety';
    summary = location ? `Broken lighting near ${location}` : 'Broken lighting and low visibility hazard';
    recommendedAction = 'Inspect and replace lighting fixture; restore safe path illumination.';
    confidence = 94;
  } else if (lower.includes('ramp') || lower.includes('wheelchair') || lower.includes('elevator') || lower.includes('lift')) {
    category = 'Accessibility';
    priority = 'Critical';
    department = 'Disability & Accessibility Infrastructure';
    summary = location ? `Accessibility barrier at ${location}` : 'Obstruction affecting accessible pathways';
    recommendedAction = 'Clear physical access pathway and verify compliance immediately.';
    confidence = 96;
  } else if (lower.includes('projector') || lower.includes('hdmi') || lower.includes('wifi') || lower.includes('pc')) {
    category = 'IT/Cybersecurity';
    priority = 'Medium';
    department = 'Campus IT & Audiovisual Infrastructure';
    summary = location ? `AV / IT failure in ${location}` : 'Classroom hardware connection failure';
    recommendedAction = 'Send technician to replace video cable/adapter and cycle power.';
    confidence = 93;
  } else if (lower.includes('leak') || lower.includes('pipe') || lower.includes('water') || lower.includes('door')) {
    category = 'Maintenance';
    priority = 'High';
    department = 'Facilities Management & Maintenance';
    summary = location ? `Maintenance issue at ${location}` : 'Utility or hardware repair required';
    recommendedAction = 'Dispatch maintenance crew to shut off valve and repair line.';
    confidence = 95;
  } else if (lower.includes('lost') || lower.includes('found') || lower.includes('wallet') || lower.includes('card')) {
    category = 'Lost & Found';
    priority = 'Low';
    department = 'Student Affairs & Property Custody';
    summary = `Lost property: ${text.slice(0, 30)}`;
    recommendedAction = 'Register item in central inventory desk.';
    confidence = 91;
  }

  return {
    category,
    priority,
    department,
    summary,
    recommendedAction,
    confidence,
    source: 'client_fallback',
    model: 'CampusGuardian Client Heuristic'
  };
}

function clientFallbackChat(message = '') {
  const lower = message.toLowerCase();
  if (lower.includes('projector') || lower.includes('hdmi') || lower.includes('wifi')) {
    return {
      reply: 'For classroom technology (projectors, audio, lab workstations) or network connectivity issues, Campus IT provides rapid classroom support. You can file an instant work order or contact Classroom AV Support at Ext. 4357.',
      suggestedActions: [{ label: 'Report IT / AV Problem', route: '/report' }],
      source: 'client_knowledge_base'
    };
  }
  if (lower.includes('card') || lower.includes('lost') || lower.includes('found')) {
    return {
      reply: 'Lost student IDs and valuables should be turned into or claimed at the Student Affairs Central Desk (Student Center, Room 102). You can register a lost or found report directly here.',
      suggestedActions: [{ label: 'File Lost & Found Report', route: '/report' }],
      source: 'client_knowledge_base'
    };
  }
  if (lower.includes('leak') || lower.includes('water') || lower.includes('plumb')) {
    return {
      reply: 'Active water leaks and plumbing failures are handled urgently by Facilities & Operations. Emergency work crews are dispatched within 15 minutes for flooding hazards.',
      suggestedActions: [{ label: 'Report Water Leak', route: '/report' }],
      source: 'client_knowledge_base'
    };
  }
  if (lower.includes('access') || lower.includes('ramp') || lower.includes('wheelchair')) {
    return {
      reply: 'Campus Accessibility Services provides mobility escorts, accessible shuttle bookings, and monitors barrier-free pathways across all buildings.',
      suggestedActions: [{ label: 'Accessibility Center', route: '/accessibility' }],
      source: 'client_knowledge_base'
    };
  }
  return {
    reply: 'CampusGuardian AI is ready to assist you with safety alerts, maintenance dispatch, or accessibility assistance. What can I help you resolve today?',
    suggestedActions: [
      { label: 'Report Campus Issue', route: '/report' },
      { label: 'Emergency Center', route: '/emergency' }
    ],
    source: 'client_knowledge_base'
  };
}
