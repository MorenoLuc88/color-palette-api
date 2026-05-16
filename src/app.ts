import express from 'express';
import cors from 'cors';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import paletteRoutes from './routes/palette.routes';
import { swaggerSpec } from './swagger';

const app = express();
const PORT = process.env.PORT ?? 3000;

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', paletteRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Color Palette API running on http://localhost:${PORT}`);
});

export default app;
