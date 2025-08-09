import { cacheService } from "./cache";

const baseURL = "http://www.poatransporte.com.br/php/facades/process.php";

const CACHE_TTL = {
  STOPS: 86400,
  ROUTES: 86400,
  ROUTE_DETAILS: 86400,
};

async function fetchWithCache(
  url: string,
  cacheKey: string,
  ttlSeconds: number,
): Promise<string> {
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cached;
  }

  console.log(`Cache miss for key: ${cacheKey}, fetching from API`);
  const response = await fetch(url);
  const data = await response.text();

  await cacheService.set(cacheKey, data, ttlSeconds);

  return data;
}

export const PoaTransporte = {
  getStops: async (): Promise<string> => {
    const url = `${baseURL}?a=tp&p=`;
    return fetchWithCache(url, "poa:stops", CACHE_TTL.STOPS);
  },

  getRoutes: async (): Promise<string> => {
    const url = `${baseURL}?a=nc&p=%&t=o`;
    return fetchWithCache(url, "poa:routes", CACHE_TTL.ROUTES);
  },

  getRouteDetails: async (routeId: string): Promise<string> => {
    const url = `${baseURL}?a=il&p=${routeId}`;
    return fetchWithCache(url, `poa:route:${routeId}`, CACHE_TTL.ROUTE_DETAILS);
  },
};
