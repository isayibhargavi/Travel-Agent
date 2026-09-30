import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_N8N_URL = 'https://isayibhargavi.app.n8n.cloud/form/24209d6a-929c-41cf-bdd5-1f25cfee3d65';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check & ping n8n form connectivity
  app.get('/api/n8n/health', async (_req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      const response = await fetch(DEFAULT_N8N_URL, {
        method: 'GET',
        headers: {
          'User-Agent': 'VagabondTravelConcierge/1.0',
        },
      });
      const latencyMs = Date.now() - startTime;
      res.json({
        connected: response.ok || response.status === 200,
        status: response.status,
        latencyMs,
        endpoint: DEFAULT_N8N_URL,
      });
    } catch (err: any) {
      res.json({
        connected: false,
        status: 500,
        latencyMs: Date.now() - startTime,
        endpoint: DEFAULT_N8N_URL,
        error: err?.message || 'Failed to connect to n8n webhook',
      });
    }
  });

  // Proxy submission to n8n Travel Agent Form
  app.post('/api/n8n/submit', async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        source,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        interests,
        travelType,
        customWebhookUrl,
      } = req.body;

      if (!name || !email || !source || !destination || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required travel details (Name, Email, Source, Destination, Dates).',
        });
      }

      const targetUrl = customWebhookUrl?.trim() || DEFAULT_N8N_URL;

      // Construct multipart/form-data payload matching the n8n form input fields
      const formData = new FormData();
      formData.append('field-0', String(name).trim());
      formData.append('field-1', String(email).trim());
      formData.append('field-2', String(source).trim());
      formData.append('field-3', String(destination).trim());
      formData.append('field-4', String(startDate).trim());
      formData.append('field-5', String(endDate).trim());
      formData.append('field-6', String(travelers || 1).trim());
      formData.append('field-7', String(budget || 0).trim());
      formData.append('field-8', String(interests || '').trim());
      formData.append('field-9', String(travelType || 'Solo').trim());

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      if (response.ok) {
        return res.json({
          success: true,
          status: response.status,
          message: 'Your itinerary request was successfully dispatched to our automated travel concierge.',
          raw: responseJson || responseText,
          submittedAt: new Date().toISOString(),
          referenceCode: `TRIP-${Date.now().toString(36).toUpperCase()}`,
        });
      } else {
        return res.status(response.status).json({
          success: false,
          status: response.status,
          error: responseText || response.statusText || 'n8n workflow rejected submission',
        });
      }
    } catch (err: any) {
      console.error('Submission proxy error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Internal proxy error transmitting to n8n',
      });
    }
  });

  // Vite middleware mounting
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
