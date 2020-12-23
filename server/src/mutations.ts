import { v4 as uuidv4 } from 'uuid';
import { getItem, updateItemExt } from './dynamodb';
import { User } from './types';
import { deploy } from './zeitAPI';
import { getSecretsValues } from './getSecrets';

const stripeLib = require('stripe');

type UpdateUserArgs = {
  id: string;
};

type CreatePageArgs = {
  userId: string;
  name: string;
};

type SavePageArgs = {
  id: string;
  userId: string;
  name: string;
  content: string;
};

type CreateStripeSessionArgs = {
  pageId: string;
  userId: string;
  returnTo: string;
};

export const updateUser = async (parent: any, { id }: UpdateUserArgs): Promise<User> => {
  const result = await getItem({
    TableName: process.env.USER_TABLE!,
    Key: {
      id,
    },
  });

  const user = result.Item;

  const updateResult = await updateItemExt({
    table: process.env.USER_TABLE!,
    keys: { id },
    data: {
      createdAt: user ? user.createdAt : new Date().toISOString(),
      lastSignedInAt: new Date().toISOString(),
    },
  });

  return {
    id,
    createdAt: updateResult.Attributes?.createdAt,
    lastSignedInAt: updateResult.Attributes?.lastSignedInAt,
  };
};

export const createPage = async (parent: any, { userId, name }: CreatePageArgs) => {
  const id = uuidv4();

  const result = await updateItemExt({
    table: process.env.PAGE_TABLE!,
    keys: { userId, id },
    data: {
      name,
      published: false,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      content: '',
    },
  });

  if (process.env.STAGE === 'prod') {
    await deploy();
  }

  return result.Attributes;
};

export const savePage = async (parent: any, { id, userId, name, content }: SavePageArgs) => {
  const result = await updateItemExt({
    table: process.env.PAGE_TABLE!,
    keys: { userId, id },
    data: {
      name,
      content,
      lastUpdatedAt: new Date().toISOString(),
    },
  });

  if (process.env.STAGE === 'prod') {
    await deploy();
  }

  return result.Attributes;
};

export const createStripeSession = async (
  parent: any,
  { pageId, userId, returnTo }: CreateStripeSessionArgs
) => {
  const { stripe_api_sk } = await getSecretsValues('Stripe', ['stripe_api_sk']);

  if (!stripe_api_sk) {
    throw new Error('No stripe API key provided');
  }

  const stripe = stripeLib(stripe_api_sk);

  const page = await getItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { userId, id: pageId },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        description: `Your hosted landing page for ${page.Item?.name}`,
        price: 'price_1HzISJGcEddESqInD3HAa1pG',
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      pageId,
    },
    success_url: `${returnTo}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: returnTo,
  });

  return { sessionId: session.id };
};
