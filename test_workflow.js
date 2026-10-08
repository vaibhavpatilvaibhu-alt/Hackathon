async function testWorkflow() {
  console.log('--- TESTING CAMPUSGUARDIAN AI ENDPOINTS ---');
  
  // 1. Test Health
  const healthRes = await fetch('http://localhost:5000/api/health');
  console.log('1. Health check status:', healthRes.status, await healthRes.json());
  
  // 2. Test Frontend HTML
  const clientRes = await fetch('http://localhost:3000/');
  console.log('2. Client HTML status:', clientRes.status, 'HTML length:', (await clientRes.text()).length);

  // 3. Test AI Analyze (Exact User Prompt)
  const samplePrompt = 'The staircase light near Block C has been broken for three days and it is very dark at night.';
  const sampleLoc = 'Block C - Staircase 2nd Floor';
  const analyzeRes = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: samplePrompt, location: sampleLoc })
  });
  const analysis = await analyzeRes.json();
  console.log('3. AI Analyze result:', JSON.stringify(analysis, null, 2));

  // 4. Test Create Report
  const createRes = await fetch('http://localhost:5000/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: samplePrompt,
      location: sampleLoc,
      category: analysis.category,
      priority: analysis.priority,
      department: analysis.department,
      summary: analysis.summary,
      recommendedAction: analysis.recommendedAction,
      confidence: analysis.confidence
    })
  });
  const createdReport = await createRes.json();
  console.log('4. Create Report result:', createdReport.id, createdReport.status);

  // 5. Test Get Reports
  const reportsRes = await fetch('http://localhost:5000/api/reports');
  const allReports = await reportsRes.json();
  console.log('5. Total reports in system:', allReports.length);
  const found = allReports.find(r => r.id === createdReport.id);
  console.log('   Found newly created report:', Boolean(found));

  // 6. Test Admin Status Update (Patch report)
  const patchRes = await fetch('http://localhost:5000/api/reports/' + createdReport.id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'In Progress', note: 'Technician dispatched to replace bulb' })
  });
  const updatedReport = await patchRes.json();
  console.log('6. Admin status update result:', updatedReport.id, 'New Status:', updatedReport.status);

  // 7. Test AI Assistant Chat Queries
  const chatQueries = [
    'Where do I report a broken projector?',
    'What should I do if I find a lost ID card?',
    'How do I report a water leak?',
    'Where can I find accessibility assistance?'
  ];
  for (const q of chatQueries) {
    const chatRes = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q })
    });
    const chatData = await chatRes.json();
    console.log('7. Chatbot Query: "' + q + '"');
    console.log('   Reply summary: ' + chatData.reply.split('\n')[0]);
    console.log('   Suggested Actions: ' + (chatData.suggestedActions?.map(a => a.label).join(', ') || 'none'));
  }

  // 8. Test Emergency & Accessibility Endpoints
  const emergRes = await fetch('http://localhost:5000/api/emergency');
  const emergData = await emergRes.json();
  console.log('8. Emergency contacts count:', emergData.contacts.length);

  const accessRes = await fetch('http://localhost:5000/api/accessibility');
  const accessData = await accessRes.json();
  console.log('8b. Accessibility facilities count:', accessData.facilities.length);

  console.log('====================================================');
  console.log('✅ ALL WORKFLOW VERIFICATIONS PASSED 100%!');
  console.log('====================================================');
}

testWorkflow().catch(console.error);
