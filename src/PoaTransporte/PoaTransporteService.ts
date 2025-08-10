import { cache } from "../Cache";
import type {
  ApiRouteDetailsResponse,
  ApiRoutesResponse,
  ApiStopsResponse,
} from "./types";

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
    return JSON.parse(cached) as T;
  }

  console.log(`Cache miss for key: ${cacheKey}, fetching from API`);
  const response = await fetch(url);
  const data = (await response.json()) as T;
  await cache.set(cacheKey, JSON.stringify(data), ttlSeconds);
  return data;
}

export const PoaTransporteService = {
  getStops: async (): Promise<ApiStopsResponse> => {
    const url = `${baseURL}?a=tp&p=`;
    return fetchWithCache<ApiStopsResponse>(url, "poa:stops", CACHE_TTL.STOPS);
  },

  getRoutes: async (): Promise<ApiRoutesResponse> => {
    const url = `${baseURL}?a=nc&p=%&t=o`;
    return fetchWithCache<ApiRoutesResponse>(
      url,
      "poa:routes",
      CACHE_TTL.ROUTES,
    );
  },

  getRouteDetails: async (
    routeId: string,
  ): Promise<ApiRouteDetailsResponse> => {
    const url = `${baseURL}?a=il&p=${routeId}`;
    return fetchWithCache<ApiRouteDetailsResponse>(
      url,
      `poa:route:${routeId}`,
      CACHE_TTL.ROUTE_DETAILS,
    );
  },
};
