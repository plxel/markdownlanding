import fetch from 'isomorphic-fetch'

export async function deploy() {
  const response = await fetch("https://api.vercel.com/v1/integrations/deploy/prj_4POe89WKW3I0NRZsh3GL32gOVUop/xi9ZyDs2xn", { method: 'POST' }).then(res => res.json());

  return response;
}