import { v4 as uuidv4 } from 'uuid'
import { getItem, updateItem } from "./dynamodb";
import { User } from "./types";
import { deploy } from './zeitAPI'

type UpdateUserArgs = {
  id: string
}

type CreatePageArgs = {
  userId: string;
  name: string;
}

type SavePageArgs = {
  id: string;
  userId: string;
  content: string;
}

export const updateUser = async (parent: any, { id } : UpdateUserArgs): Promise<User> => {
  const result = await getItem({
    TableName: process.env.USER_TABLE!,
    Key: {
      id,
    },
  });

  const user = result.Item;

  const updateResult = await updateItem({
    TableName: process.env.USER_TABLE!,
    Key: { id },
    UpdateExpression: "SET createdAt = :createdAt, lastSignedInAt = :lastSignedInAt",
    ExpressionAttributeValues: {
      ":createdAt": user ? user.createdAt : new Date().toISOString(),
      ":lastSignedInAt": new Date().toISOString()
    },
    ReturnValues: "ALL_NEW",
  })

  return {
    id,
    createdAt: updateResult.Attributes?.createdAt,
    lastSignedInAt: updateResult.Attributes?.lastSignedInAt,
  }

};

export const createPage = async (parent: any, { userId, name }: CreatePageArgs) => {
  const id = uuidv4()
  
  const result = await updateItem({
    TableName: process.env.PAGE_TABLE!,
    Key: { userId, id },
    UpdateExpression: "SET #name = :name, createdAt = :createdAt, content = :content",
    ExpressionAttributeValues: {
      ":name": name,
      ":createdAt": new Date().toISOString(),
      ":content": "",
    },
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ReturnValues: "ALL_NEW",
  })


  if (process.env.STAGE === 'prod') {
    await deploy()
  }

  return result.Attributes;
}

export const savePage = async (parent: any, { id, userId, content }: SavePageArgs) => {
  
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

  if (process.env.STAGE === 'prod') {
    await deploy()
  }

  return result.Attributes;
}