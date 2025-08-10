import { cache } from "../Cache";
import type {
  ApiRouteDetailsResponse,
  ApiRoutesResponse,
  ApiStopsResponse,
} from "./types";

/** Base URL for Porto Alegre Transport API */
const baseURL = "http://www.poatransporte.com.br/php/facades/process.php";

/** Cache TTL configuration in seconds (24 hours for all endpoints) */
const CACHE_TTL = {
  STOPS: 86400,
  ROUTES: 86400,
  ROUTE_DETAILS: 86400,
};

/**
 * Fetches data from URL with Redis caching support
 * @template T - Type of the expected response data
 * @param {string} url - API endpoint URL to fetch from
 * @param {string} cacheKey - Redis cache key for storing/retrieving data
 * @param {number} ttlSeconds - Time to live in seconds for cached data
 * @returns {Promise<T>} Cached or freshly fetched data
 */
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

/**
 * Service for interacting with Porto Alegre Transport API
 * Provides methods to fetch stops, routes, and route details with caching
 */
export const PoaTransporteService = {
  /**
   * Fetches all bus stops in Porto Alegre
   * @returns {Promise<ApiStopsResponse>} Array of bus stops with their routes
   */
  getStops: async (): Promise<ApiStopsResponse> => {
    const url = `${baseURL}?a=tp&p=`;
    return fetchWithCache<ApiStopsResponse>(url, "poa:stops", CACHE_TTL.STOPS);
  },

  /**
   * Fetches all bus routes in Porto Alegre
   * @returns {Promise<ApiRoutesResponse>} Array of available bus routes
   */
  getRoutes: async (): Promise<ApiRoutesResponse> => {
    const url = `${baseURL}?a=nc&p=%&t=o`;
    return fetchWithCache<ApiRoutesResponse>(
      url,
      "poa:routes",
      CACHE_TTL.ROUTES,
    );
  },

  /**
   * Fetches detailed information for a specific bus route
   * @param {string} routeId - Unique identifier for the bus route
   * @returns {Promise<ApiRouteDetailsResponse>} Route details including coordinates
   */
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
