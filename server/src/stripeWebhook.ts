import { APIGatewayEvent } from 'aws-lambda';
import { updateItemExt } from './dynamodb';
import { deploy } from './zeitAPI';
import { getSecretsValues } from './getSecrets';

const stripeLib = require('stripe');

export const handler = async (
  event: APIGatewayEvent,
  context: any,
  callback: any
): Promise<any> => {
  const { stripe_webhook_secret, stripe_api_pk } = await getSecretsValues('Stripe', [
    'stripe_webhook_secret',
    'stripe_api_pk',
  ]);

  if (!stripe_api_pk || !stripe_webhook_secret) {
    callback(null, { statusCode: 400 });
    return;
  }

  const stripe = stripeLib(stripe_api_pk);
  const sig = event.headers['Stripe-Signature'];

  try {
    const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, stripe_webhook_secret);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;

      const { pageId, userId } = session.metadata;

      await updateItemExt({
        table: process.env.PAGE_TABLE!,
        keys: { userId, id: pageId },
        data: {
          published: true,
          lastUpdatedAt: new Date().toISOString(),
        },
      });

      if (process.env.STAGE === 'prod') {
        await deploy();
      }
    }

    const response = {
      statusCode: 200,
    };

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
    });
  }
};
