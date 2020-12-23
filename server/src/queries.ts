import { getItem, scanItems } from './dynamodb';

export type PageArgs = {
  id: string;
  userId: string;
};

export type UserPagesArgs = {
  userId: string;
};

export const allPublishedPages = async () => {
  const result = await scanItems({
    TableName: process.env.PAGE_TABLE!,
    FilterExpression: 'published = :published',
    ExpressionAttributeValues: { ':published': true },
  });

  return result.Items;
};

export const allUserPages = async (parent: any, { userId }: UserPagesArgs) => {
  // TODO: add pagination
  const result = await scanItems({
    TableName: process.env.PAGE_TABLE!,
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  });

  return result.Items;
};

export const page = async (parent: any, { id, userId }: PageArgs) => {
  const result = await getItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { id, userId },
  });

  return result.Item;
};
