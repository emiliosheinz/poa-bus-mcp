import type {
  ApiRouteDetailsResponse,
  ApiRoutesResponse,
  ApiStopsResponse,
} from "./PoaTransporte/types";
import type {
  RouteDetailsFetcherResult,
  RoutesFetcherResult,
  StopsFetcherResult,
} from "./types";

/**
 * Transforms API stop response data to internal stop format
 * @param {ApiStopsResponse} apiStops - Raw stop data from Porto Alegre Transport API
 * @returns {StopsFetcherResult} Transformed stop data with normalized field names
 */
export function transformStops(apiStops: ApiStopsResponse): StopsFetcherResult {
  return apiStops.map((apiStop) => ({
    code: apiStop.codigo,
    latitude: apiStop.latitude,
    longitude: apiStop.longitude,
    terminal: apiStop.terminal,
    routes: apiStop.linhas.map((linha) => ({
      id: linha.idLinha,
      code: linha.codigoLinha,
      name: linha.nomeLinha,
    })),
  }));
}

/**
 * Transforms API route response data to internal route format
 * @param {ApiRoutesResponse} apiRoutes - Raw route data from Porto Alegre Transport API
 * @returns {RoutesFetcherResult} Transformed route data with normalized field names
 */
export function transformRoutes(apiRoutes: ApiRoutesResponse): RoutesFetcherResult {
  return apiRoutes.map((apiRoute) => ({
    id: apiRoute.id,
    code: apiRoute.codigo,
    name: apiRoute.nome,
  }));
}

/**
 * Transforms API route details response to internal format
 * Extracts and sorts coordinate data from numeric keys in the response
 * @param {ApiRouteDetailsResponse} apiRouteDetails - Raw route details from API including coordinates
 * @returns {RouteDetailsFetcherResult} Transformed route details with sorted coordinates array
 */
export function transformRouteDetails(
  apiRouteDetails: ApiRouteDetailsResponse
): RouteDetailsFetcherResult {
  // Extract coordinates from numeric keys
  const coordinates = Object.entries(apiRouteDetails)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => ({
      index: Number(key),
      value: value as { lat: string; lng: string },
    }))
    .sort((a, b) => a.index - b.index)
    .map(({ value }) => ({
      latitude: value.lat,
      longitude: value.lng,
    }));

  return {
    id: apiRouteDetails.idlinha,
    name: apiRouteDetails.nome,
    code: apiRouteDetails.codigo,
    coordinates,
  };
}
