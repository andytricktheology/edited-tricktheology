
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(process.cwd(), 'data.json');

// Initial data structure
const INITIAL_DATA = {
  posts: [],
  merch: [],
  books: [],
  podcasts: [],
  comments: [],
  pages: [],
  adminConfig: {
    email: "admin@gmail.com",
    passwordHash: "veilcipher"
  }
};

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
  }
}

async function readData() {
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  await ensureDataFile();
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/data', async (req, res) => {
    try {
      const data = await readData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  app.post('/api/data', async (req, res) => {
    try {
      await writeData(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
