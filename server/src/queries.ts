import { getItem, scanItems } from './dynamodb'

export type PageArgs = {
  id: string;
  userId: string;
}

export const allPages = async () => {
  // TODO: add pagination
  const result = await scanItems({
    TableName: process.env.PAGE_TABLE!
  })

  return result.Items;
}

export const page = async (parent: any, { id, userId }: PageArgs) => {
  const result = await getItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { id, userId }
  })

  return result.Item;
}