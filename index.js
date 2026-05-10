const express = require('express');
const cors = require('cors');
const { findEngine, DIESEL_DB } = require('./engine-db');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rate limiter
const rateLimitMap = new Map();
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 20;
  const requests = rateLimitMap.get(ip) || [];
  const recent = requests.filter(t => now - t < windowMs);
  if (recent.length >= max) return res.status(429).json({ error: 'Too many requests' });
  recent.push(now);
  rateLimitMap.set(ip, recent);
  next();
}

// In-memory traffic stats
const stats = { totalRequests: 0, chatRequests: 0, analyzeRequests: 0, uniqueSessions: new Set(), startTime: Date.now() };

function getUptime() {
  const ms = Date.now() - stats.startTime;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

// Diesel system prompt
const DIESEL_SYSTEM_PROMPT = `You are Diesel Dude, an expert AI diagnostic assistant for diesel-powered vehicles and heavy equipment. You have deep expertise in:

ENGINES: Cummins (ISX, ISB, X15, QSK), Caterpillar (C7, C9, C13, C15, 3406E), Detroit Diesel (DD13, DD15, Series 60), John Deere PowerTech, International/Navistar (DT466, MaxxForce, A26), Volvo (D13, D16), Mack (MP8, MP7), PACCAR (MX-13, MX-11), Power Stroke (6.7, 6.0, 7.3), Duramax (LML, L5P), Cummins Ram 6.7

SYSTEMS: Fuel systems (common rail, HEUI, unit injectors, CP3/CP4 pumps), Emissions (DPF, SCR, DEF, EGR, DOC), Turbochargers (VGT, wastegate, twin turbo), Electrical (ECM, sensors, J1939 CAN bus), Hydraulics, Transmissions (Allison, Eaton Fuller, automated)

EQUIPMENT: Class 8 semis, heavy equipment (CAT, Komatsu, Deere, Volvo CE, Case), pickup trucks (F-250/350, Ram 2500/3500, Silverado/Sierra HD), municipal fleets, generators, agricultural equipment

FAULT CODES: OBD2, SAE J1939 SPN/FMI codes, manufacturer-specific codes (CAT ET, Cummins Insite, Detroit DDL, Allison DOC)

APPROACH:
- Give practical, hands-on diagnostic steps a working mechanic can execute
- Reference specific tools when needed (Cummins Insite, CAT ET, Detroit DDL, JPRO, ServiceMaxx)
- Include safety warnings for high-pressure fuel systems, hot DEF, electrical hazards
- When you know fault codes are involved, explain the SPN/FMI meaning
- Mention DPF/DEF/SCR issues clearly — they're the most common problem in modern diesel
- Be direct and confident. These are professionals who need real answers, not disclaimers
- Use plain text only. Do NOT use emoji characters in responses — they may not render correctly on all devices.
- At the end of every response, add a SOURCES section. List the specific service manual, section, or spec document you drew from. Format exactly like this:

SOURCES:
- Cummins ISX Service Manual, Section 6.3 - Fuel System Diagnosis
- SAE J1939 SPN 157 FMI 18 - Injector Metering Rail Pressure

If you are drawing from general knowledge rather than a specific manual, write: SOURCES: General diesel diagnostic knowledge.

If the user mentions their specific asset (year/make/model/engine), tailor your response exactly to that unit.`;

// Chat endpoint
app.post('/api/chat', rateLimiter, async (req, res) => {
  const { message, sessionId, assetContext, language } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  stats.totalRequests++;
  stats.chatRequests++;
  if (sessionId) stats.uniqueSessions.add(sessionId);

  // Check if we have engine info
  const engineInfo = findEngine(message) || findEngine(assetContext);
  let systemMsg = DIESEL_SYSTEM_PROMPT;
  if (engineInfo) {
    systemMsg += `\n\nCURRENT ENGINE CONTEXT: ${engineInfo.make} ${engineInfo.model} - ${engineInfo.displacement || ''} ${engineInfo.power || ''}. Application: ${engineInfo.application || ''}. Common issues: ${(engineInfo.commonFaults || []).join(', ')}.`;
  }
  if (assetContext) {
    systemMsg += `\n\nACTIVE ASSET: ${assetContext}`;
  }
  if (language && language !== 'en') {
    systemMsg += `\n\nRespond in the user's language: ${language}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Photo analysis
app.post('/api/analyze', rateLimiter, async (req, res) => {
  const { image, question, assetContext } = req.body;
  if (!image) return res.status(400).json({ error: 'Image required' });

  stats.totalRequests++;
  stats.analyzeRequests++;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: `${DIESEL_SYSTEM_PROMPT}\n\n${assetContext ? `Asset: ${assetContext}\n` : ''}Analyze this diesel engine/equipment photo and identify: what component is shown, any visible damage, wear, leaks, or issues, and what action is recommended. ${question || ''}` },
          { type: 'image_url', image_url: { url: image } }
        ]
      }],
      max_tokens: 800,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fault code lookup
app.post('/api/codes/lookup', rateLimiter, async (req, res) => {
  const { code, make, model } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });

  try {
    const prompt = `Diesel fault code lookup: ${code}${make ? ` on a ${make} ${model || ''}` : ''}\n\nProvide: 1) What this code means, 2) Common causes, 3) Diagnostic steps, 4) Likely fix. Be specific and practical.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: DIESEL_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
    });
    res.json({ reply: completion.choices[0].message.content, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Engine lookup
app.get('/api/engines/search', (req, res) => {
  const { q } = req.query;
  const result = findEngine(q);
  res.json(result || { error: 'Engine not found' });
});

app.get('/api/engines', (req, res) => {
  res.json(Object.values(DIESEL_DB));
});

// Status
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    app: 'Diesel Dude API by WastedApe',
    uptime: getUptime(),
    openAIConfigured: !!process.env.OPENAI_API_KEY,
    traffic: {
      totalRequests: stats.totalRequests,
      chatRequests: stats.chatRequests,
      photoAnalysis: stats.analyzeRequests,
      uniqueSessions: stats.uniqueSessions.size,
    }
  });
});

app.get('/', (req, res) => res.json({ message: 'Diesel Dude API by WastedApe', version: '1.0.0' }));

// Analytics tracking
const pageViews = {};
const signups = { count: 0 };

app.post('/api/analytics/pageview', (req, res) => {
  const { page } = req.body;
  if (page) {
    pageViews[page] = (pageViews[page] || 0) + 1;
    stats.totalRequests++;
  }
  res.json({ ok: true });
});

app.post('/api/analytics/signup', (req, res) => {
  signups.count++;
  res.json({ ok: true });
});

app.get('/api/analytics', (req, res) => {
  res.json({
    inMemory: stats,
    pageViews,
    signups: signups.count,
    uptime: getUptime()
  });
});

// Manual search via OpenAI Assistants + Vector Store
const DD_ASSISTANT_ID = process.env.DD_ASSISTANT_ID || 'asst_zkMFm5os1xpWenLesyuPhnIY';

app.post('/api/manual-search', rateLimiter, async (req, res) => {
  const { query, assetContext } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });
  try {
    // Create thread
    const thread = await openai.beta.threads.create();
    // Add message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `${assetContext ? `Asset context: ${assetContext}\n` : ''}Manual search query: ${query}`
    });
    // Run assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, { assistant_id: DD_ASSISTANT_ID });
    if (run.status !== 'completed') return res.status(500).json({ error: 'Search failed' });
    // Get response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const reply = messages.data[0]?.content[0]?.type === 'text' ? messages.data[0].content[0].text.value : 'No result found.';
    res.json({ reply, source: 'manual' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Diesel Dude API running on port ${PORT}`));
