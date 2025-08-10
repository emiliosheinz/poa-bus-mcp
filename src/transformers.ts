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
  const transformed: RouteDetailsFetcherResult = {
    id: apiRouteDetails.idlinha,
    name: apiRouteDetails.nome,
    code: apiRouteDetails.codigo,
  };

  Object.entries(apiRouteDetails).forEach(([key, value]) => {
    const numKey = Number(key);
    if (!Number.isNaN(numKey) && typeof value === "object" && "lat" in value && "lng" in value) {
      transformed[numKey] = {
        latitude: value.lat,
        longitude: value.lng,
      };
    }
  });

  return transformed;
}
