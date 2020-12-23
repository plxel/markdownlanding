import { SecretsManager } from 'aws-sdk';

const region = 'us-east-1';

const client = new SecretsManager({
  region,
});

type SecretsDictionary = {
  [key: string]: string;
};

export async function getSecrets(secretName: string): Promise<SecretsDictionary | string> {
  return new Promise((res, rej) => {
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      if (err) {
        rej(err);
      } else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
          const secret = data.SecretString;
          res(JSON.parse(secret || ''));
        } else {
          let buff = new Buffer(data.SecretBinary?.toString() || '', 'base64');
          const decodedBinarySecret = buff.toString('ascii');
          res(decodedBinarySecret);
        }
      }
    });
  });
}

export async function getSecretsValues(
  secretName: string,
  secretKeyNames: Array<string>
): Promise<SecretsDictionary> {
  let result = {};
  try {
    const secrets = await getSecrets(secretName);
    if (typeof secrets === 'object') {
      result = secretKeyNames.reduce((acc: { [key: string]: string }, key) => {
        acc[key] = secrets[key];
        return acc;
      }, {});
    }
  } catch {}

  return result;
}
