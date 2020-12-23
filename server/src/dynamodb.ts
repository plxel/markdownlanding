import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

interface UpdateItemParams {
  TableName: string;
  Key: {
    [key: string]: string;
  };
  UpdateExpression: string;
  ExpressionAttributeValues: {
    [key: string]: string | number | undefined | null | boolean;
  };
  ExpressionAttributeNames?: {
    [key: string]: string;
  };
  ReturnValues?: string;
}

interface GetItemParams {
  TableName: string;
  Key: {
    [key: string]: string;
  };
}

interface DeleteItemParams {
  TableName: string;
  Key: {
    [key: string]: string;
  };
  ReturnValues?: string;
}

interface ScanItemsParams {
  TableName: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: {
    [key: string]: string;
  };
  ExpressionAttributeValues?: {
    [key: string]: string | number | undefined | null | boolean | object;
  };
  Limit?: number;
}

// Used for upserting items
export const updateItem = async (
  params: UpdateItemParams
): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> => {
  const query = {
    ReturnValues: 'ALL_NEW',
    ...params,
  };

  return new Promise((resolve, reject) => {
    dynamoDB.update(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// collect all fields in a JSON object into a DynamoDB expression
export const buildExpression = (body: any) => {
  return Object.keys(body)
    .map((key: string) => `#${key} = :${key}`)
    .join(', ');
};

// collect all fields in a JSON objct into DynamoDB attributes
export const buildAttributes = (body: any) => {
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      `:${key}`,
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? value
        : JSON.stringify(value),
    ])
  );
};

export const buildAttributeNames = (body: any) => {
  return Object.keys(body).reduce((acc: { [key: string]: string }, key) => {
    acc[`#${key}`] = key;
    return acc;
  }, {});
};

// Used for getting items based on a key
export const getItem = async (
  params: GetItemParams
): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> => {
  const query = {
    ...params,
  };

  return new Promise((resolve, reject) => {
    dynamoDB.get(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Used for searching tables
export const scanItems = async (
  params: ScanItemsParams
): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> => {
  const query = {
    ...params,
  };

  return new Promise((resolve, reject) => {
    dynamoDB.scan(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Used for deleting items
export const deleteItem = async (
  params: DeleteItemParams
): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> => {
  const query = {
    ReturnValues: 'ALL_OLD',
    ...params,
  };

  return new Promise((resolve, reject) => {
    dynamoDB.delete(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

type UpdateItemArgs = {
  table: string;
  keys: {
    [key: string]: string;
  };
  data: { [key: string]: any };
  returnValues?: string;
};

export const updateItemExt = async ({
  table,
  keys,
  data,
  returnValues = 'ALL_NEW',
}: UpdateItemArgs): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> => {
  return updateItem({
    TableName: table,
    Key: keys,
    ReturnValues: returnValues,
    UpdateExpression: `SET ${buildExpression(data)}`,
    ExpressionAttributeValues: buildAttributes(data),
    ExpressionAttributeNames: buildAttributeNames(data),
  });
};
