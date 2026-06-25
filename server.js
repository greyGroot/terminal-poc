import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const DB_PATH = path.join(__dirname, 'database.json');

app.use(express.json());

// Custom Logger
function logEvent(event, message) {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  console.log(`[${time}] [${event}] ${message}`);
}

// Helpers for Database
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    logEvent('ERROR', 'Failed to read database.json');
    return { prizes: [] };
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    logEvent('ERROR', 'Failed to write to database.json');
  }
}

// REST Endpoints for Admin Panel
app.get('/api/config', async (req, res) => {
  const db = await readDB();
  res.json(db);
});

app.post('/api/config', async (req, res) => {
  await writeDB(req.body);
  logEvent('ADMIN', 'Prize pool updated');
  res.json({ success: true });
});

// Serve Vite build if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Socket.io Logic
io.on('connection', (socket) => {
  logEvent('CLIENT_CONNECT', `Client connected: ${socket.id}`);
  io.emit('NETWORK_STATUS', { clients: io.engine.clientsCount });

  socket.on('disconnect', () => {
    logEvent('CLIENT_DISCONNECT', `Client disconnected: ${socket.id}`);
    io.emit('NETWORK_STATUS', { clients: io.engine.clientsCount });
  });

  socket.on('GAME_START', async (userData) => {
    logEvent('GAME_START', `Game initiated by ${userData.name}`);
    
    // 1. Tell TV to start roulette animation
    io.emit('ROULETTE_SPIN');
    
    // 2. Determine prize
    const db = await readDB();
    const availablePrizes = db.prizes.filter(p => p.quantity > 0);
    
    let result = { type: 'no_prize', userData };
    
    // WIN_PROBABILITY determines how often people win when cooldown is inactive. 
    // Set to 1.0 (100%) so that the very next game AFTER the cooldown expires is a guaranteed win.
    const WIN_PROBABILITY = 1.0;
    let isWin = Math.random() < WIN_PROBABILITY;

    // Check Cooldown
    const now = Date.now();
    const cooldownMs = (db.cooldownMinutes || 0) * 60 * 1000;
    const lastWin = db.lastWinTimestamp || 0;
    
    if (now - lastWin < cooldownMs) {
      isWin = false;
      logEvent('GAME_START', `Cooldown active. Forced loss. Time left: ${Math.round((cooldownMs - (now - lastWin))/60000)} min`);
    }
    
    if (isWin && availablePrizes.length > 0) {
      // Pick random prize
      const prizeIndex = Math.floor(Math.random() * availablePrizes.length);
      const selectedPrize = availablePrizes[prizeIndex];
      
      // Update DB
      const dbPrize = db.prizes.find(p => p.id === selectedPrize.id);
      dbPrize.quantity -= 1;
      db.lastWinTimestamp = now;
      await writeDB(db);
      
      result = { type: 'prize', prize: dbPrize, userData };
      logEvent('RESULT_CALCULATED', `Prize selected: ${dbPrize.name_en}`);
    } else {
      logEvent('RESULT_CALCULATED', `No prize awarded. Using fallback.`);
      // Randomly pick a no-prize message index (0 to 23 for 24 variants)
      result = { type: 'no_prize', messageIndex: Math.floor(Math.random() * 24), userData };
    }

    // 3. Wait 10 seconds, then emit result
    setTimeout(() => {
      io.emit('SHOW_RESULT', result);
      logEvent('SHOW_RESULT', `Broadcasted result to all screens`);
    }, 10000);
  });

  socket.on('SET_LANGUAGE', (lang) => {
    logEvent('LANGUAGE', `Language changed to ${lang}`);
    io.emit('LANGUAGE_UPDATED', { lang });
  });

  socket.on('NAME_ENTERED', (userData) => {
    logEvent('NAME_ENTERED', `Name entered: ${userData.name}`);
    io.emit('NAME_ENTERED', userData);
  });

  socket.on('RESET_STATE', () => {
    logEvent('RESET_STATE', 'Admin triggered emergency reset');
    io.emit('RESET_STATE');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logEvent('SYSTEM', `Server running on port ${PORT}`);
  console.log('\n=======================================');
  console.log('🌟 MASTERCARD TERMINAL - DEV URLS 🌟');
  console.log('=======================================');
  console.log(`📱 iPad Screen:    http://localhost:5173/ipad`);
  console.log(`📺 TV Screen:      http://localhost:5173/tv`);
  console.log(`⚙️  Admin Panel:    http://localhost:5173/admin`);
  console.log('=======================================\n');
});
