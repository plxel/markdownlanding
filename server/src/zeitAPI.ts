import fetch from 'isomorphic-fetch';
import { getSecretsValues } from './getSecrets';

export async function deploy() {
  const { vercel_webhook_endpoint } = await getSecretsValues('Vercel', ['vercel_webhook_endpoint']);

  if (!vercel_webhook_endpoint) {
    return Promise.resolve();
  }

  const response = await fetch(vercel_webhook_endpoint, { method: 'POST' }).then((res) =>
    res.json()
  );

  return response;
}
