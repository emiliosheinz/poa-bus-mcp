type Coordinate = {
  latitude: string;
  longitude: string;
};

type Route = {
  id: string;
  code: string;
  name: string;
};

type Stop = {
  code: string;
  latitude: string;
  longitude: string;
  terminal: string;
  routes: Route[];
};

type RouteDetails = Route & { [key: number]: Coordinate };

export type StopsFetcherResult = Stop[];

export type RoutesFetcherResult = Route[];

export type RouteDetailsFetcherResult = RouteDetails;
