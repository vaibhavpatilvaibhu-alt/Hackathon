const express = require('express');
const router = express.Router();
const { analyzeIssue, chatWithAssistant } = require('../services/aiService');

// In-memory reports store seeded with realistic initial campus data
let reportsStore = [
  {
    id: 'CG-2026-1001',
    createdAt: '2026-10-07T08:15:00.000Z',
    description: 'The staircase light near Block C has been broken for three days and it is very dark at night.',
    location: 'Block C - Staircase 2nd Floor',
    category: 'Safety',
    priority: 'High',
    department: 'Facilities Management & Maintenance',
    summary: 'Broken lighting near Block C staircase creating nocturnal fall hazard',
    recommendedAction: 'Inspect electrical fixture, replace ballast/LED bulb, verify ambient illumination',
    confidence: 94,
    status: 'In Progress',
    reporter: 'Student (vaibhav.p@campus.edu)',
    assignedStaff: 'Officer M. Davies (Facilities)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-07T08:15:00.000Z', note: 'Logged via CampusGuardian AI' },
      { status: 'Under Review', timestamp: '2026-10-07T09:00:00.000Z', note: 'AI triage verified by Ops Center' },
      { status: 'In Progress', timestamp: '2026-10-07T11:30:00.000Z', note: 'Work Order #WO-8912 issued' }
    ]
  },
  {
    id: 'CG-2026-1002',
    createdAt: '2026-10-07T11:45:00.000Z',
    description: 'Wheelchair access ramp at North Library entrance is obstructed by heavy delivery crates and construction signage.',
    location: 'Central Library - North Ramp Entrance',
    category: 'Accessibility',
    priority: 'Critical',
    department: 'Disability & Accessibility Infrastructure',
    summary: 'Wheelchair accessibility ramp obstructed by heavy cargo',
    recommendedAction: 'Immediate dispatch to clear obstruction, inspect slope compliance, and notify campus security.',
    confidence: 98,
    status: 'Assigned',
    reporter: 'Student (ananya.s@campus.edu)',
    assignedStaff: 'Accessibility Team (J. Miller)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-07T11:45:00.000Z', note: 'Reported via Accessibility Quick Form' },
      { status: 'Assigned', timestamp: '2026-10-07T12:05:00.000Z', note: 'Priority escalated to Critical' }
    ]
  },
  {
    id: 'CG-2026-1003',
    createdAt: '2026-10-06T15:20:00.000Z',
    description: 'Overhead projector in Science Hall 302 won\'t recognize HDMI or USB-C inputs during lecture, causing class delays.',
    location: 'Science Complex - Lecture Hall 302',
    category: 'IT/Cybersecurity',
    priority: 'Medium',
    department: 'Campus IT & Audiovisual Infrastructure',
    summary: 'Lecture hall 302 projector input signal failure',
    recommendedAction: 'Replace AV matrix switcher cable and perform firmware test on controller.',
    confidence: 91,
    status: 'Resolved',
    reporter: 'Faculty (Prof. Sterling)',
    assignedStaff: 'IT Support Desk (Tech Alex)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-06T15:20:00.000Z', note: 'Report submitted' },
      { status: 'In Progress', timestamp: '2026-10-06T16:00:00.000Z', note: 'HDMI dongle replaced' },
      { status: 'Resolved', timestamp: '2026-10-06T17:15:00.000Z', note: 'Audio/video tested successfully' }
    ]
  },
  {
    id: 'CG-2026-1004',
    createdAt: '2026-10-08T09:10:00.000Z',
    description: 'High-pressure water pipe leaking under hand wash sink in Ground Floor Restroom of Engineering Wing B.',
    location: 'Engineering Wing B - Ground Floor Washroom',
    category: 'Maintenance',
    priority: 'High',
    department: 'Facilities Management & Maintenance',
    summary: 'Plumbing leak under washroom sink risking floor water damage',
    recommendedAction: 'Shut off isolation valve and replace fractured coupling.',
    confidence: 95,
    status: 'Under Review',
    reporter: 'Student (karan.m@campus.edu)',
    assignedStaff: 'Pending Assignment',
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-08T09:10:00.000Z', note: 'Logged with photo attachment' }
    ]
  },
  {
    id: 'CG-2026-1005',
    createdAt: '2026-10-08T14:05:00.000Z',
    description: 'Left blue Herschel backpack with engineering notebook and student ID card in Dining Commons booth 4.',
    location: 'Campus Dining Commons - South Booth 4',
    category: 'Lost & Found',
    priority: 'Low',
    department: 'Student Affairs & Property Custody',
    summary: 'Lost blue Herschel backpack containing ID and notebook',
    recommendedAction: 'Check dining staff custody log and tag in CampusGuardian Lost registry.',
    confidence: 93,
    status: 'Submitted',
    reporter: 'Student (priya.k@campus.edu)',
    assignedStaff: 'Desk Custodian',
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-08T14:05:00.000Z', note: 'Item registered in database' }
    ]
  }
];

// Configurable Campus Emergency Contacts
const EMERGENCY_CONTACTS = [
  {
    id: 'sec-rapid',
    name: 'Campus Security Rapid Response',
    phone: '555-0199',
    extension: 'Ext. 5555',
    available: '24/7 / 365 Days',
    description: 'On-campus armed & unarmed safety patrol dispatch, emergency blue light response, and active escort services.',
    badge: 'Immediate Dispatch',
    category: 'Security'
  },
  {
    id: 'med-center',
    name: 'University Health & Medical Center',
    phone: '555-0188',
    extension: 'Ext. 5556',
    available: '8:00 AM - 10:00 PM (Emergency on-call 24/7)',
    description: 'First aid, minor trauma triage, emergency allergic reaction care, and paramedic escort coordination.',
    badge: 'Medical EMT',
    category: 'Medical'
  },
  {
    id: 'counsel-crisis',
    name: 'Campus Crisis & Mental Health Helpline',
    phone: '555-0177',
    extension: 'Ext. 5559',
    available: '24/7 Confidential',
    description: 'Trained psychological first aid responders for distress, panic, trauma support, and student safety.',
    badge: 'Confidential',
    category: 'Mental Health'
  },
  {
    id: 'campus-admin',
    name: 'Campus Emergency Marshall & Operations',
    phone: '555-0166',
    extension: 'Ext. 5550',
    available: '24/7 Emergency Operations Center',
    description: 'Building evacuations, severe weather shelter coordination, hazardous spill containment, and infrastructure outages.',
    badge: 'Administration',
    category: 'Operations'
  }
];

// Safety Protocols
const SAFETY_PROTOCOLS = [
  {
    id: 'proto-fire',
    title: 'Fire & Alarm Evacuation Protocol',
    steps: [
      'Immediately evacuate via designated stairwells — do NOT use elevators.',
      'Pull the nearest manual fire alarm station on your exit route.',
      'Assemble at your building\'s Designated Safe Assembly Point (Zone A - Green Lawn).',
      'Report any missing classmates or individuals requiring mobility assistance to Fire Wardens.'
    ]
  },
  {
    id: 'proto-weather',
    title: 'Severe Storm / Flash Flood Safety',
    steps: [
      'Move away from exterior glass windows and skylights into interior corridors.',
      'If on lower basement levels during flash flood alert, ascend to Level 2 or higher.',
      'Check CampusGuardian live safety broadcasts before traversing campus bridges.'
    ]
  },
  {
    id: 'proto-medical',
    title: 'Medical Emergency First Response',
    steps: [
      'Call Ext. 5556 or trigger Emergency SOS in CampusGuardian with your GPS room number.',
      'Locate Automated External Defibrillator (AED) — available in every building lobby.',
      'Do not move an injured person with potential spinal injuries unless immediate fire hazard exists.',
      'Station someone at the building main entrance to guide EMT paramedics to the room.'
    ]
  },
  {
    id: 'proto-night',
    title: 'SafeWalk Escort Program',
    steps: [
      'Available every evening from 6:00 PM to 4:00 AM for any student or faculty.',
      'Request an officer to accompany you across campus to parking lots, dorms, or transit stops.',
      'Request via the app or pick up any Campus Blue Light station phone.'
    ]
  }
];

// Accessibility Resources & Facilities Directory
const ACCESSIBILITY_RESOURCES = {
  facilities: [
    {
      id: 'fac-1',
      name: 'Central Library North Ramp',
      type: 'Mobility Ramp',
      status: 'Attention Required',
      notes: 'Obstruction reported today; crew actively clearing crates. South ramp fully operational.',
      accessibleRoute: 'Alternative: South Plaza automatic revolving door (Level 1)'
    },
    {
      id: 'fac-2',
      name: 'Science Complex Elevator Tower A',
      type: 'Elevator',
      status: 'Operational',
      notes: 'Equipped with tactile Braille buttons, voice floor annunciator, and emergency call panel.',
      accessibleRoute: 'Direct step-free access to all 5 laboratory levels'
    },
    {
      id: 'fac-3',
      name: 'Auditorium Magna Hearing Induction Loop',
      type: 'Audio Assistance',
      status: 'Operational',
      notes: 'T-coil induction loop active for students with hearing aids and FM receivers.',
      accessibleRoute: 'Reserve wireless receiver pack at AV control booth'
    },
    {
      id: 'fac-4',
      name: 'Student Center South Accessible Restrooms',
      type: 'Restroom Facility',
      status: 'Operational',
      notes: 'Gender-inclusive, ADA-compliant wide door, power activation button, emergency pull cord.',
      accessibleRoute: 'Ground Floor, adjacent to Wellness Lounge'
    },
    {
      id: 'fac-5',
      name: 'East Campus Shuttle Route 2 (Wheelchair Lift)',
      type: 'Transit',
      status: 'Operational',
      notes: 'Low-floor electric shuttle with automated hydraulic ramp and two secure wheelchair locks.',
      accessibleRoute: 'Departs every 12 mins from Campus Transit Hub'
    }
  ],
  services: [
    {
      title: 'Mobility & Wheelchair Assistance',
      description: 'Step-free campus route maps, automated power door maintenance, accessible golf cart escorts, and assistive shuttle scheduling.',
      contact: 'mobility@aegis-campus.edu'
    },
    {
      title: 'Visual & Sensory Support',
      description: 'Braille signage inspection, tactile pavement audit, screen-reader friendly syllabus transcription, and high-contrast facility maps.',
      contact: 'visual-support@aegis-campus.edu'
    },
    {
      title: 'Deaf & Hard of Hearing Support',
      description: 'Real-time CART captioning services for lectures, sign language interpreter booking, and visual strobe alarm verification.',
      contact: 'hearing-access@aegis-campus.edu'
    },
    {
      title: 'Sensory & Neurodiversity Accommodations',
      description: 'Sensory decompression quiet pods located in Library 2nd floor and Student Pavilion 3rd floor.',
      contact: 'neuro-wellness@aegis-campus.edu'
    }
  ]
};

// 1. Analyze Issue Endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { text, location } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Issue description is required.' });
    }

    const analysis = await analyzeIssue(text.trim(), (location || '').trim());
    res.json(analysis);
  } catch (err) {
    console.error('Error analyzing issue:', err);
    res.status(500).json({ error: 'Failed to analyze issue', details: err.message });
  }
});

// 2. Chatbot Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const response = await chatWithAssistant(message.trim(), history || []);
    res.json(response);
  } catch (err) {
    console.error('Error in chat assistant:', err);
    res.status(500).json({ error: 'Failed to communicate with assistant', details: err.message });
  }
});

// 3. Get all reports
router.get('/reports', (req, res) => {
  res.json(reportsStore);
});

// 4. Create new report
router.post('/reports', (req, res) => {
  try {
    const {
      description,
      location,
      category,
      priority,
      department,
      summary,
      recommendedAction,
      confidence,
      imageUrl
    } = req.body;

    if (!description || !location) {
      return res.status(400).json({ error: 'Description and location are required.' });
    }

    const uniqueId = `CG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newReport = {
      id: uniqueId,
      createdAt: now,
      description: description.trim(),
      location: location.trim(),
      category: category || 'Other',
      priority: priority || 'Medium',
      department: department || 'General Campus Operations',
      summary: summary || description.slice(0, 50),
      recommendedAction: recommendedAction || 'Inspect and address reported issue.',
      confidence: confidence || 92,
      status: 'Submitted',
      imageUrl: imageUrl || null,
      reporter: 'Student (Logged in user)',
      assignedStaff: 'Pending Triage',
      timeline: [
        { status: 'Submitted', timestamp: now, note: 'Logged via CampusGuardian AI' }
      ]
    };

    // Prepend to top of reports store
    reportsStore.unshift(newReport);

    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: 'Failed to create report', details: err.message });
  }
});

// 5. Update report (for admin)
router.patch('/reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, department, assignedStaff, note } = req.body;

    const reportIndex = reportsStore.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = reportsStore[reportIndex];
    const now = new Date().toISOString();

    if (status && status !== report.status) {
      report.status = status;
      report.timeline.push({
        status,
        timestamp: now,
        note: note || `Status updated to ${status} by Administrator`
      });
    }

    if (department) {
      report.department = department;
    }

    if (assignedStaff) {
      report.assignedStaff = assignedStaff;
    }

    reportsStore[reportIndex] = report;
    res.json(report);
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  }
});

// 6. Reset reports to demo state
router.post('/reports/reset', (req, res) => {
  // Can be called to reset demo
  res.json({ message: 'Demo reports state retained' });
});

// 7. Emergency Contacts & Protocols
router.get('/emergency', (req, res) => {
  res.json({
    contacts: EMERGENCY_CONTACTS,
    protocols: SAFETY_PROTOCOLS,
    campusDisclaimer: 'DEMO CAMPUS EMERGENCY SYSTEM: For actual immediate off-campus life-threatening emergencies, always dial 911/112.'
  });
});

// 8. Accessibility Directory
router.get('/accessibility', (req, res) => {
  res.json(ACCESSIBILITY_RESOURCES);
});

// 9. Health & System Status
router.get('/health', (req, res) => {
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  res.json({
    status: 'healthy',
    service: 'CampusGuardian AI Backend',
    timestamp: new Date().toISOString(),
    aiEngine: {
      geminiConfigured: hasGemini,
      fallbackEngineActive: true,
      activeModel: hasGemini ? 'Gemini 2.0 Flash' : 'CampusGuardian RuleEngine (Active Offline)'
    }
  });
});

module.exports = router;
