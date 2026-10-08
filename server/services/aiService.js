/**
 * CampusGuardian AI - Core AI Service
 * Features:
 * 1. Gemini API Integration via secure backend
 * 2. High-precision Local Fallback Rule & Keyword Classifier
 * 3. Campus Knowledge Base Assistant with Action Recommendations
 */

// Comprehensive Campus Knowledge Base for offline/fallback intelligence
const CAMPUS_KNOWLEDGE_BASE = [
  {
    keywords: ['projector', 'hdmi', 'screen', 'audio', 'speaker', 'mic', 'microphone', 'wifi', 'internet', 'network', 'login', 'portal', 'computer', 'lab pc', 'printer'],
    category: 'IT/Cybersecurity',
    department: 'Campus IT & AV Services',
    quickAnswer: 'For classroom technology (projectors, audio, lab workstations) or network connectivity issues, Campus IT provides rapid classroom support. You can file an instant work order or contact Classroom AV Support at Ext. 4357.',
    action: { label: 'Report IT / AV Problem', route: '/report', prefillCategory: 'IT/Cybersecurity' }
  },
  {
    keywords: ['id card', 'lost card', 'wallet', 'keys', 'found', 'backpack', 'phone', 'laptop left', 'lost and found', 'missing item'],
    category: 'Lost & Found',
    department: 'Student Affairs & Security Lost & Found',
    quickAnswer: 'Lost student IDs and valuables should be turned into or claimed at the Student Affairs Central Desk (Student Center, Room 102) or the Campus Security Office. If you lost your ID card, immediately freeze your campus meal/door access via the student portal.',
    action: { label: 'File Lost & Found Report', route: '/report', prefillCategory: 'Lost & Found' }
  },
  {
    keywords: ['water leak', 'pipe', 'flood', 'ceiling leak', 'restroom', 'toilet', 'tap', 'drain', 'plumbing', 'overflow'],
    category: 'Maintenance',
    department: 'Facilities & Emergency Plumbing',
    quickAnswer: 'Active water leaks and plumbing failures are prioritized by Facilities & Operations. For major leaks risking electrical fixtures or flooding, our emergency maintenance crew is dispatched within 15 minutes.',
    action: { label: 'Report Water Leak', route: '/report', prefillCategory: 'Maintenance', priority: 'High' }
  },
  {
    keywords: ['accessibility', 'wheelchair', 'ramp', 'elevator', 'lift', 'braille', 'hearing', 'mobility', 'accessible', 'disability', 'escort', 'barrier'],
    category: 'Accessibility',
    department: 'Disability & Accessibility Services',
    quickAnswer: 'Campus Accessibility Services provides mobility escorts, accessible shuttle bookings, and maintains step-free navigation across all campus buildings. All reported accessibility barriers receive immediate priority status.',
    action: { label: 'Visit Accessibility Center', route: '/accessibility' }
  },
  {
    keywords: ['security', 'emergency', 'police', 'threat', 'stalk', 'harass', 'suspicious', 'assault', 'fire', 'dark', 'light broken', 'safe walk', 'guard'],
    category: 'Safety',
    department: 'Campus Safety & Rapid Response',
    quickAnswer: 'Campus Safety Officers patrol 24/7. Blue light emergency phone towers are stationed every 200 meters. For immediate emergencies, call Security Dispatch at Ext. 5555 or trigger the Emergency SOS button in the app.',
    action: { label: 'Open Emergency Center', route: '/emergency' }
  },
  {
    keywords: ['air condition', 'ac', 'heating', 'hvac', 'too hot', 'too cold', 'ventilation', 'smell', 'odor', 'trash', 'cleaning', 'garbage'],
    category: 'Facilities',
    department: 'Facilities & Environmental Services',
    quickAnswer: 'Temperature controls and custodial cleanups are handled by Environmental Services. Submit a location-tagged request and building engineers will calibrate the HVAC zone.',
    action: { label: 'Report Facility Issue', route: '/report', prefillCategory: 'Facilities' }
  }
];

// Fallback Issue Analyzer
function fallbackAnalyzeIssue(text = '', location = '') {
  const lower = text.toLowerCase();
  const lowerLoc = (location || '').toLowerCase();
  const combined = `${lower} ${lowerLoc}`;

  let category = 'Other';
  let priority = 'Medium';
  let department = 'Campus Operations Desk';
  let confidence = 86;
  let summary = '';
  let recommendedAction = '';

  // Critical indicators
  const criticalSignals = [
    'fire', 'smoke', 'explosion', 'sparking', 'sparks', 'gas leak', 'chemical',
    'weapon', 'assault', 'fight', 'bleeding', 'unconscious', 'cardiac', 'collapse',
    'live wire', 'electrocution', 'active threat', 'stuck in elevator'
  ];

  // High indicators
  const highSignals = [
    'dark', 'broken light', 'broken lock', 'cannot lock', 'security gate', 'flood',
    'water leaking', 'slippery', 'ice', 'blocked exit', 'fire exit blocked',
    'broken ramp', 'wheelchair ramp blocked', 'elevator down', 'elevator broken',
    'harassment', 'stalking', 'suspicious person', 'theft', 'stolen'
  ];

  // Low indicators
  const lowSignals = [
    'flickering', 'paint', 'scuffed', 'trash can full', 'litter', 'poster',
    'dust', 'lost book', 'water bottle', 'squeaky door', 'remote battery'
  ];

  // Priority detection
  if (criticalSignals.some(k => combined.includes(k))) {
    priority = 'Critical';
    confidence = 96;
  } else if (highSignals.some(k => combined.includes(k))) {
    priority = 'High';
    confidence = 92;
  } else if (lowSignals.some(k => combined.includes(k))) {
    priority = 'Low';
    confidence = 88;
  }

  // Category & Department Detection
  if (
    combined.includes('light') || combined.includes('dark') || combined.includes('security') ||
    combined.includes('lock') || combined.includes('theft') || combined.includes('suspicious') ||
    combined.includes('harass') || combined.includes('safety') || combined.includes('door access') ||
    combined.includes('intruder') || combined.includes('blue light')
  ) {
    category = 'Safety';
    if (combined.includes('light') || combined.includes('dark')) {
      department = 'Maintenance & Campus Safety';
      summary = location ? `Broken lighting near ${location}` : 'Broken lighting and low visibility hazard';
      recommendedAction = 'Inspect and replace staircase lighting; restore illuminated pathway.';
      confidence = 94;
    } else {
      department = 'Campus Security & Safety Operations';
      summary = `Safety concern regarding security vulnerability near ${location || 'campus facility'}`;
      recommendedAction = priority === 'Critical' || priority === 'High'
        ? 'Dispatch security patrol unit to secure area and inspect lighting/access control immediately.'
        : 'Log security patrol check and verify perimeter sensors during next scheduled round.';
    }
  } else if (
    combined.includes('ramp') || combined.includes('wheelchair') || combined.includes('elevator') ||
    combined.includes('lift') || combined.includes('braille') || combined.includes('tactile') ||
    combined.includes('automatic door') || combined.includes('accessible') || combined.includes('hearing loop')
  ) {
    category = 'Accessibility';
    department = 'Disability & Accessibility Infrastructure';
    // Accessibility disruptions are automatically elevated to at least High
    if (priority === 'Medium' || priority === 'Low') priority = 'High';
    summary = location ? `Accessibility barrier reported at ${location}` : 'Physical or structural accessibility barrier';
    recommendedAction = 'Deploy accessibility rapid response crew to clear obstruction and verify ADA compliance.';
    confidence = 96;
  } else if (
    combined.includes('projector') || combined.includes('hdmi') || combined.includes('wifi') ||
    combined.includes('internet') || combined.includes('network') || combined.includes('computer') ||
    combined.includes('login') || combined.includes('monitor') || combined.includes('audio') ||
    combined.includes('smart board') || combined.includes('printer')
  ) {
    category = 'IT/Cybersecurity';
    department = 'Campus IT & Audiovisual Infrastructure';
    summary = location ? `Classroom AV / IT failure in ${location}` : 'IT hardware or network connectivity failure';
    recommendedAction = 'Send classroom tech specialist to test cabling, replace faulty hardware, and reboot AV controller.';
    confidence = 93;
  } else if (
    combined.includes('leak') || combined.includes('pipe') || combined.includes('plumbing') ||
    combined.includes('water') || combined.includes('broken glass') || combined.includes('ceiling') ||
    combined.includes('roof') || combined.includes('tile') || combined.includes('door broken') ||
    combined.includes('window broken') || combined.includes('staircase') || combined.includes('handrail')
  ) {
    category = 'Maintenance';
    department = 'Facilities Management & Maintenance';
    summary = location ? `Maintenance issue at ${location}` : 'Structural or utility maintenance requirement';
    recommendedAction = 'Issue urgent work order to facilities crew for on-site inspection and physical repair.';
    confidence = 95;
  } else if (
    combined.includes('lost') || combined.includes('found') || combined.includes('wallet') ||
    combined.includes('keys') || combined.includes('card') || combined.includes('backpack') ||
    combined.includes('phone') || combined.includes('headphones')
  ) {
    category = 'Lost & Found';
    department = 'Student Affairs & Property Custody';
    summary = `Personal property reported: ${extractSubject(text, 'unclaimed item')}`;
    recommendedAction = 'Cross-reference serial/student ID in registry and safeguard item at central desk.';
    priority = 'Low';
    confidence = 92;
  } else if (
    combined.includes('ac') || combined.includes('heat') || combined.includes('hvac') ||
    combined.includes('cold') || combined.includes('hot') || combined.includes('trash') ||
    combined.includes('cleaning') || combined.includes('smell') || combined.includes('restroom clean')
  ) {
    category = 'Facilities';
    department = 'Campus Environmental & Custodial Services';
    summary = location ? `Environmental service request for ${location}` : 'Environmental and custodial service request';
    recommendedAction = 'Dispatch custodial/HVAC technician to inspect ambient environment and service area.';
    confidence = 90;
  } else {
    category = 'Other';
    department = 'General Campus Operations';
    summary = `Campus issue reported: ${text.slice(0, 45)}...`;
    recommendedAction = 'Route to operations coordinator for initial triage and manual assessment.';
    confidence = 86;
  }

  // Refine summary if empty
  if (!summary) {
    summary = `Reported: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`;
  }

  return {
    category,
    priority,
    department,
    summary,
    recommendedAction,
    confidence
  };
}

function extractSubject(text, fallback) {
  const words = text.split(/\s+/).slice(0, 8).join(' ');
  return words || fallback;
}

/**
 * Call Gemini API using REST endpoint
 */
async function callGeminiAnalyze(apiKey, text, location) {
  const prompt = `You are the CampusGuardian AI triage engine for a university campus.
Analyze this student incident report:
Text: "${text}"
Location: "${location || 'Not specified'}"

Respond ONLY with valid, raw JSON (no markdown formatting, no code blocks, no backticks):
{
  "category": "Safety" | "Maintenance" | "IT/Cybersecurity" | "Accessibility" | "Lost & Found" | "Facilities" | "Other",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "department": "Name of responsible university department",
  "summary": "Concise 1-sentence title/summary of the issue",
  "recommendedAction": "Actionable next step for campus dispatch",
  "confidence": <integer between 80 and 99>
}`;

  // Using standard Gemini 2.0 Flash or 1.5 Flash API endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 300
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini API');

  // Strip possible markdown fences
  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Validate fields
  return {
    category: parsed.category || 'Maintenance',
    priority: ['Critical', 'High', 'Medium', 'Low'].includes(parsed.priority) ? parsed.priority : 'Medium',
    department: parsed.department || 'Campus Facilities',
    summary: parsed.summary || text.slice(0, 60),
    recommendedAction: parsed.recommendedAction || 'Inspect and address reported issue.',
    confidence: Number(parsed.confidence) || 94
  };
}

/**
 * Main Issue Analyzer with Automatic Fallback
 */
async function analyzeIssue(text, location = '') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here') {
    try {
      const result = await callGeminiAnalyze(apiKey.trim(), text, location);
      return {
        ...result,
        source: 'gemini',
        model: 'Gemini 2.0 Flash'
      };
    } catch (err) {
      console.warn('Gemini API call failed, activating CampusGuardian local fallback AI engine:', err.message);
      const fallbackResult = fallbackAnalyzeIssue(text, location);
      return {
        ...fallbackResult,
        source: 'local_fallback',
        model: 'CampusGuardian RuleEngine (Offline Fallback)',
        fallbackReason: err.message
      };
    }
  }

  // If no Gemini API key configured, seamlessly use local fallback
  const fallbackResult = fallbackAnalyzeIssue(text, location);
  return {
    ...fallbackResult,
    source: 'local_fallback',
    model: 'CampusGuardian RuleEngine (Active)'
  };
}

/**
 * Assistant Chat with Campus Knowledge Base & Fallback
 */
async function chatWithAssistant(message = '', history = []) {
  const lowerMsg = message.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY;

  // Check matching knowledge base entries
  const matchedEntry = CAMPUS_KNOWLEDGE_BASE.find(entry =>
    entry.keywords.some(kw => lowerMsg.includes(kw))
  );

  // If Gemini API is available, ask Gemini with campus context
  if (apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here') {
    try {
      const contextPrompt = `You are "GuardianBot", the friendly, knowledgeable 24/7 AI Campus Assistant for CampusGuardian AI at Aegis Tech University.
Your role:
- Help students with campus safety, maintenance reporting, accessibility services, lost & found, emergency procedures, and campus navigation.
- Keep answers helpful, warm, concise, and actionable (2-4 sentences max).
- If relevant, mention that they can file a report directly or use the emergency/accessibility centers.

Student question: "${message}"`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: contextPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 350 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          const suggestedActions = [];
          if (matchedEntry && matchedEntry.action) {
            suggestedActions.push(matchedEntry.action);
          } else {
            suggestedActions.push({ label: 'Report This Issue', route: '/report' });
          }

          return {
            reply: replyText.trim(),
            suggestedActions,
            source: 'gemini',
            timestamp: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn('Gemini chat failed, using local assistant knowledge base:', err.message);
    }
  }

  // Local Fallback Knowledge Base response
  if (matchedEntry) {
    const suggestedActions = [matchedEntry.action];
    if (matchedEntry.category === 'Safety') {
      suggestedActions.push({ label: 'View Emergency Contacts', route: '/emergency' });
    } else if (matchedEntry.category === 'Accessibility') {
      suggestedActions.push({ label: 'Request Mobility Escort', route: '/accessibility' });
    }

    return {
      reply: `${matchedEntry.quickAnswer}\n\nOur system can route this directly to ${matchedEntry.department}.`,
      suggestedActions,
      source: 'local_knowledge_base',
      timestamp: new Date().toISOString()
    };
  }

  // General helpful fallback response
  return {
    reply: `I can assist you with campus safety reports, maintenance work orders, accessibility requests, or lost & found inquiries. For urgent emergencies, please access the Emergency Center immediately. How can I best guide you today?`,
    suggestedActions: [
      { label: 'Report Campus Issue', route: '/report' },
      { label: 'Emergency Center', route: '/emergency' },
      { label: 'Accessibility Services', route: '/accessibility' },
      { label: 'View My Reports', route: '/my-reports' }
    ],
    source: 'local_knowledge_base',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  analyzeIssue,
  chatWithAssistant,
  CAMPUS_KNOWLEDGE_BASE
};
