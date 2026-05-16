import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import paletteRoutes from './routes/palette.routes';

const app = express();
const PORT = process.env.PORT ?? 3000;

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', paletteRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Color Palette API running on http://localhost:${PORT}`);
});

export default app;
