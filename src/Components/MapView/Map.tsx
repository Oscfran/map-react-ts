import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import useClipboard from "../Hooks/useClipboard.tsx";
import useDocumentTitle from "../Hooks/useDocumentTitle.tsx";
import useQueryParameters from "../Hooks/useQueryParameters.tsx";
import getLocationName from "../Utils/getLocationName.tsx";
import "../Styles/Radix.css";
import "../Styles/Map.css";
import TabsComponent from "../Elements/TabsComponent.tsx";

const API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = "http://localhost:5173/";
type Food =
	| "Asian"
	| "Italian"
	| "Fast-Food"
	| "Fine-Dining"
	| "Local-Food"
	| "Buffet";
interface MarkerInfo {
	id: string;
	name: string;
	lat: number;
	lng: number;
	description: string;
	rating: number;
	favorite: boolean;
	price: number;
	foodType: Food;
	imageURLs: string[];
}

const MapApi = () => {
	const generateId = () => crypto.randomUUID();
	const { params, setQueryParameters } = useQueryParameters();
	const { copyToClipboard } = useClipboard();
	const [storedLocation, setStoredLocation] = useLocalStorage<{
		lat: number;
		lng: number;
	}>("mapLocation", { lat: 9.8990415, lng: -84.1556396 });
	const [map, setMap] = useState<google.maps.Map>();
	const [pageTitle, setPageTitle] = useState("My map!!!");
	const [latitude, setLatitude] = useState<number>(
		Number.parseFloat(params.get("latitude") ?? "") || storedLocation.lat,
	);
	const [longitude, setLongitude] = useState<number>(
		Number.parseFloat(params.get("longitude") ?? "") || storedLocation.lng,
	);
	const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
	const [isLoading, setLoading] = useState(false);
	const [open, setOpen] = useState<boolean>(false);
	const [favorite, setFavorite] = useState<boolean>(false);
	const [markers, setMarkers] = useState<
		google.maps.marker.AdvancedMarkerElement[]
	>([]);
	const [markerData, setMarkerData] = useLocalStorage<MarkerInfo[]>(
		"markers",
		[],
	);
	const [imageURL, setImageURL] = useState<string>("");
	const clearFilters = () => {
		setFilters({
			searchQuery: "",
			minRating: 0,
			onlyFavorites: false,
			onlyVisibleArea: false,
			asianFood: false,
			italianFood: false,
			fastFood: false,
			fineDiningFood: false,
			localFood: false,
			buffetFood: false,
			maxPrice: 500,
			clearFilters: () => clearFilters(),
		});
	};
	const [filters, setFilters] = useState({
		searchQuery: "",
		minRating: 0,
		onlyFavorites: false,
		onlyVisibleArea: false,
		asianFood: false,
		italianFood: false,
		fastFood: false,
		fineDiningFood: false,
		localFood: false,
		buffetFood: false,
		maxPrice: 500,
		clearFilters: () => clearFilters(),
	});
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<MarkerInfo>({
		defaultValues: {
			id: generateId(),
			imageURLs: [],
			rating: 5,
			favorite: false,
			foodType: "Asian",
		},
	});
	const [sliderValue, setSliderValue] = useState(5);
	const imageURLs = watch("imageURLs") || [];

	useEffect(() => {
		// Initialize and add the map
		((g) => {
			let h: Promise<unknown>;
			let a;
			let k;
			const p = "The Google Maps JavaScript API";
			const c = "google";
			const l = "importLibrary";
			const q = "__ib__";
			const m = document;
			let b = window;
			b = b[c] || (b[c] = {});
			const d = b.maps || (b.maps = {});
			const r = new Set();
			const e = new URLSearchParams();
			const u = () =>
				h ||
				(h = new Promise(async (f, n) => {
					await (a = m.createElement("script"));
					e.set("libraries", `${[...r]}`);
					for (k in g)
						e.set(
							k.replace(/[A-Z]/g, (t) => `_${t[0].toLowerCase()}`),
							g[k],
						);
					e.set("callback", `${c}.maps.${q}`);
					a.src = `https://maps.${c}apis.com/maps/api/js?${e}`;
					d[q] = f;
					a.onerror = () => (h = n(Error(`${p} could not load.`)));
					a.nonce = m.querySelector("script[nonce]")?.nonce || "";
					m.head.append(a);
				}));
			d[l]
				? console.warn(`${p} + " only loads once. Ignoring:"`, g)
				: (d[l] = (f: unknown, ...n: any) =>
						r.add(f) && u().then(() => d[l](f, ...n)));
		})({
			key: API,
			v: "weekly",
			// Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
			// Add other bootstrap parameters as needed, using camel case.
		});

		async function initMap() {
			// The location of Costa Rica Map
			// Request needed libraries.
			//@ts-ignore
			const { Map } = await google.maps.importLibrary("maps");

			// The map starts at Costa Rica
			const newMap = new google.maps.Map(
				document.getElementById("map-container") as HTMLElement,
				{
					zoom: 8,
					center: { lat: Number(latitude), lng: Number(longitude) },
					mapId: "app",
				},
			);
			const newInfoWindow = new window.google.maps.InfoWindow();
			const placeName = await getLocationName(latitude, longitude, API);
			setMap(newMap);
			setPageTitle(placeName);
			setInfoWindow(newInfoWindow);
		}

		initMap();
	}, []);

	useEffect(() => {
		if (map && infoWindow) {
			const handleMapClick = (e: {
				latLng: { lat: () => number; lng: () => number };
			}) => {
				const clickedLat = e.latLng.lat();
				const clickedLng = e.latLng.lng();
				setLatitude(clickedLat);
				setLongitude(clickedLng);
				setValue("lat", clickedLat);
				setValue("lng", clickedLng);
				setStoredLocation({
					lat: clickedLat,
					lng: clickedLng,
				});
				const fetchName = async () => {
					const placeName = await getLocationName(clickedLat, clickedLng, API);
					setPageTitle(placeName);

					//the infowindow has diferent carateristics so we are going to divided by sections
					const contentString = `
					<div>
						<h3>${placeName}</h3>
						<p className= "infoWindow-text">Lat ${clickedLat.toFixed(5)}, Lng: ${clickedLng.toFixed(5)}</p>
						<button id="copy-btn" style="all: revert; border-radius: 4px; padding: 0 15px; font-size: 15px; line-height: 1; font-weight: 500; height: 35px; cursor : pointer"> Copy to clipboard </button>
					</div>
					`;

					//shows infowindow with the coords
					infoWindow.setContent(contentString);
				};
				fetchName();
				setQueryParameters("latitude", String(clickedLat));
				setQueryParameters("longitude", String(clickedLng));
				const locationURL = `${BASE_URL}?latitude=${clickedLat}&longitude=${clickedLng}`;
				infoWindow.setPosition({ lat: clickedLat, lng: clickedLng });
				infoWindow.open(map);

				const observer = new MutationObserver(() => {
					const copyBtn = document.getElementById("copy-btn");
					if (copyBtn) {
						copyBtn.addEventListener("click", () =>
							copyToClipboard(locationURL),
						);
						observer.disconnect();
					}
				});
				observer.observe(document.body, { childList: true, subtree: true });
			};
			map.addListener("click", handleMapClick);
			if (markerData.length > 0) {
				const fetchMarkers = async () => {
					const { AdvancedMarkerElement } =
						await google.maps.importLibrary("marker");

					const newMarkers = markerData.map((info) => {
						const marker = new AdvancedMarkerElement({
							map: map,
							position: { lat: Number(info.lat), lng: Number(info.lng) },
							title: info.name,
						});
						return marker;
					});
					setMarkers(newMarkers);
				};
				fetchMarkers();
			}
			return () => {
				window.google.maps.event.clearListeners(map, "click"); //clear listeners
			};
		}
	}, [map, infoWindow]);

	const filteredMarkeredData = markerData.filter((marker) => {
		const matchesName = marker.name
			.toLowerCase()
			.includes(filters.searchQuery.toLowerCase());
		const matchesRating = marker.rating
			? marker.rating >= filters.minRating
			: true;

		const matchesPrice = marker.price ? marker.price <= filters.maxPrice : true;

		const matchesFavorites = !filters.onlyFavorites || marker.favorite;

		const matchesAsian = !filters.asianFood && marker.foodType === "Asian";
		const matchesItalian =
			!filters.italianFood && marker.foodType === "Italian";
		const matchesFastFood =
			!filters.fastFood && marker.foodType === "Fast-Food";
		const matchesFineDining =
			!filters.fineDiningFood && marker.foodType === "Fine-Dining";
		const matchesLocalFood =
			!filters.localFood && marker.foodType === "Local-Food";
		const matchesBuffet = !filters.buffetFood && marker.foodType === "Buffet";

		const notFiltersActive = !(
			filters.asianFood ||
			filters.italianFood ||
			filters.fastFood ||
			filters.fineDiningFood ||
			filters.localFood ||
			filters.buffetFood
		);
		const matchesType =
			!(
				matchesAsian ||
				matchesItalian ||
				matchesFastFood ||
				matchesFineDining ||
				matchesLocalFood ||
				matchesBuffet
			) || notFiltersActive;

		const matchesVisible =
			!map ||
			!filters.onlyVisibleArea ||
			map
				.getBounds()
				?.contains({ lat: Number(marker.lat), lng: Number(marker.lng) });

		return (
			matchesName &&
			matchesRating &&
			matchesPrice &&
			matchesFavorites &&
			matchesType &&
			matchesVisible
		);
	});

	const updatePosition = (pos: { lat: number; lng: number }, zoom = 14) => {
		setStoredLocation(pos);
		map?.panTo(pos);
		map?.setZoom(zoom);
	};
	const handleTarget = (item: MarkerInfo) => {
		const pos = {
			lat: Number(item.lat),
			lng: Number(item.lng),
		};
		updatePosition(pos);
	};

	const handleEdit = async (id: string) => {
		const index = markerData.findIndex((item) => item.id === id);
		console.log(id);
	};

	const handleRemove = (id: string) => {
		const index = markerData.findIndex((item) => item.id === id);
		if (index !== -1) {
			markers[index].map = null;
			setMarkers((markers) => {
				return markers.filter((marker) => marker !== markers[index]);
			});
			setMarkerData((prev) => prev.filter((marker) => marker.id !== id));
		}
	};

	const handleClickWhereAmI = async () => {
		if (!navigator.geolocation) {
			// Browser doesn't support Geolocation
			alert("Browser doesn't support Geolocation!!!");
			return;
		}
		setLoading(true);
		navigator.geolocation.getCurrentPosition(async (position) => {
			const pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			setLatitude(pos.lat);
			setLongitude(pos.lng);
			updatePosition(pos);
			const placeName = await getLocationName(pos.lat, pos.lng, API);
			setPageTitle(placeName);
			setLoading(false);
		});
	};


	useDocumentTitle(pageTitle);

	return (
		<TabsComponent
			isLoading = {isLoading}
			handleClickWhereAmI={handleClickWhereAmI}
			filters={filters}
			setFilters={setFilters}
			open={open}
			setOpen={setOpen}
			filteredMarkeredData={filteredMarkeredData}
			handleRemove={handleRemove}
			handleEdit={handleEdit}
			handleTarget={handleTarget}
			map={map}
			markers={markers}
			setMarkers={setMarkers}
			setMarkerData={setMarkerData}
			setPageTitle={setPageTitle}
			updatePosition={updatePosition}
			API={API}
		/>
	);
};
export default MapApi;
