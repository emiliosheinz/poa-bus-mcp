const baseURL = "http://www.poatransporte.com.br/php/facades/process.php";

export const PoaTransporte = {
	getStops: () => fetch(`${baseURL}?a=tp&p=`),
	getRoutes: () => fetch(`${baseURL}?a=nc&p=%&t=o`),
	getRouteDetails: (routeId: string) => fetch(`${baseURL}?a=il&p=${routeId}`),
};
