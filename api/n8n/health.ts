const DEFAULT_N8N_URL = 'https://isayibhargavi.app.n8n.cloud/form/24209d6a-929c-41cf-bdd5-1f25cfee3d65';

export default async function handler(_req: any, res: any) {
  const startTime = Date.now();
  try {
    const response = await fetch(DEFAULT_N8N_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'VagabondTravelConcierge/1.0',
      },
    });
    const latencyMs = Date.now() - startTime;
    return res.status(200).json({
      connected: response.ok || response.status === 200,
      status: response.status,
      latencyMs,
      endpoint: DEFAULT_N8N_URL,
    });
  } catch (err: any) {
    return res.status(200).json({
      connected: false,
      status: 500,
      latencyMs: Date.now() - startTime,
      endpoint: DEFAULT_N8N_URL,
      error: err?.message || 'Failed to connect to n8n webhook',
    });
  }
}
