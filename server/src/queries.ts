import { getItem, scanItems } from './dynamodb'

export const allPages = async () => {
  // TODO: add pagination
  const result = await scanItems({
    TableName: process.env.PAGE_TABLE!
  })

  return result.Items;
}

export const page = async (parent: any, { id, userId }: { id: string, userId: string }) => {
  const result = await getItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { id, userId }
  })

  return result.Item;
}