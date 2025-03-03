async function getDistanceBetweenPoints(
	p1: google.maps.LatLng | google.maps.LatLngLiteral,
	p2: google.maps.LatLng | google.maps.LatLngLiteral,
) {
	const { spherical } = await google.maps.importLibrary("geometry");
	const distanceInMeters = await spherical.computeDistanceBetween(p1, p2);
	if (distanceInMeters < 1000) {
		return `${distanceInMeters.toFixed(2)} Mts`;
	}
	return `${(distanceInMeters / 1000).toFixed(2)} Km`;
}
export default getDistanceBetweenPoints;
