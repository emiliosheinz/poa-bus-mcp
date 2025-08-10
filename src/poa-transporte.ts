import { cache } from "./cache";

const baseURL = "http://www.poatransporte.com.br/php/facades/process.php";

const CACHE_TTL = {
  STOPS: 86400,
  ROUTES: 86400,
  ROUTE_DETAILS: 86400,
};

async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  ttlSeconds: number,
): Promise<T> {
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for key: ${cacheKey}`);
    try {
      return JSON.parse(cached) as T;
    } catch {
      // If cache has invalid JSON, fetch fresh data
      console.warn(`Invalid cached JSON for key: ${cacheKey}, fetching fresh data`);
    }
  }

  console.log(`Cache miss for key: ${cacheKey}, fetching from API`);
  const response = await fetch(url);
  const text = await response.text();
  
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    // If API returns non-JSON, treat as empty array
    console.warn(`API returned non-JSON data for ${url}`);
    data = [] as T;
  }

  await cache.set(cacheKey, JSON.stringify(data), ttlSeconds);

  return data;
}

export const PoaTransporte = {
  getStops: async (): Promise<unknown[]> => {
    const url = `${baseURL}?a=tp&p=`;
    return fetchWithCache<unknown[]>(url, "poa:stops", CACHE_TTL.STOPS);
  },

  getRoutes: async (): Promise<unknown[]> => {
    const url = `${baseURL}?a=nc&p=%&t=o`;
    return fetchWithCache<unknown[]>(url, "poa:routes", CACHE_TTL.ROUTES);
  },

  getRouteDetails: async (routeId: string): Promise<unknown> => {
    const url = `${baseURL}?a=il&p=${routeId}`;
    return fetchWithCache<unknown>(url, `poa:route:${routeId}`, CACHE_TTL.ROUTE_DETAILS);
  },
};
