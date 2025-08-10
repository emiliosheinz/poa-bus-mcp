type ApiCoordinates = {
  lat: string;
  lng: string;
};

type ApiStop = {
  codigo: string;
  latitude: string;
  longitude: string;
  terminal: string;
  linhas: {
    idLinha: string;
    codigoLinha: string;
    nomeLinha: string;
  }[];
};

type ApiRoute = {
  id: string;
  codigo: string;
  nome: string;
};

type ApiRouteDetails = {
  [key: number]: ApiCoordinates;
  idlinha: string;
  nome: string;
  codigo: string;
};

export type ApiStopsResponse = ApiStop[];

export type ApiRoutesResponse = ApiRoute[];

export type ApiRouteDetailsResponse = ApiRouteDetails;
