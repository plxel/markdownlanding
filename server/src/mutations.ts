import { v4 as uuidv4 } from 'uuid'
import { getItem, updateItem } from "./dynamodb";
import { User } from "./types";

export const updateUser = async (parent: any, {
  id,
}: {
  id: string;
}): Promise<User> => {
  const result = await getItem({
    TableName: process.env.USER_TABLE!,
    Key: {
      id,
    },
  });

  const user = result.Item;

  if (user) {
    const result = await updateItem({
      TableName: process.env.USER_TABLE!,
      Key: { id },
      UpdateExpression: "SET lastSignedInAt = :lastSignedInAt",
      ExpressionAttributeValues: {
        ":lastSignedInAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW",
    })

    return {
      id,
      createdAt: result.Attributes?.createdAt,
      lastSignedInAt: result.Attributes?.lastSignedInAt,
    }
  }
  else {
    const result = await updateItem({
      TableName: process.env.USER_TABLE!,
      Key: { id },
      UpdateExpression: "SET createdAt = :createdAt, lastSignedInAt = :lastSignedInAt",
      ExpressionAttributeValues: {
        ":createdAt": new Date().toISOString(),
        ":lastSignedInAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW",
    })

    return {
      id,
      createdAt: result.Attributes?.createdAt,
      lastSignedInAt: result.Attributes?.lastSignedInAt,
    }
   }

};

export const createPage = async (parent: any, { userId, name }: { userId: string, name: string }) => {
  const id = uuidv4()
  
  const result = await updateItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { userId, id },
    UpdateExpression: "SET #name = :name, createdAt = :createdAt",
    ExpressionAttributeValues: {
      ":name": name,
      ":createdAt": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ReturnValues: "ALL_NEW",
  })

  return result.Attributes;
}

export const savePage = async (parent: any, { id, userId, content }: { id: string, userId: string, content: string }) => {
  
  const result = await updateItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { userId, id },
    UpdateExpression: "SET #content = :content, lastUpdatedAt = :lastUpdatedAt",
    ExpressionAttributeValues: {
      ":content": content,
      ":lastUpdatedAt": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      '#content': 'content',
    },
    ReturnValues: "ALL_NEW",
  })

  return result.Attributes;
}