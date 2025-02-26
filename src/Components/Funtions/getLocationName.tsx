const getLocationName = async (lat: number, lng: string | number, API: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].formatted_address;
        }
        return "Unknown location";
    } catch (error) {
        console.error("Error getting places name", error);
        return "Error getting places name";
    }
};
export default getLocationName;