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

export function transformRoutes(apiRoutes: ApiRoutesResponse): RoutesFetcherResult {
  return apiRoutes.map((apiRoute) => ({
    id: apiRoute.id,
    code: apiRoute.codigo,
    name: apiRoute.nome,
  }));
}

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
