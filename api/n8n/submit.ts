const DEFAULT_N8N_URL = 'https://isayibhargavi.app.n8n.cloud/form/24209d6a-929c-41cf-bdd5-1f25cfee3d65';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

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
    } = req.body || {};

    if (!name || !email || !source || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required travel details (Name, Email, Source, Destination, Dates).',
      });
    }

    const targetUrl = customWebhookUrl?.trim() || DEFAULT_N8N_URL;

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
    } catch {}

    if (response.ok) {
      return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal proxy error transmitting to n8n',
    });
  }
}
