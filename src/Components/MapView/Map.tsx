import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useClipboard from "../Hooks/useClipboard.tsx";
import useDocumentTitle from "../Hooks/useDocumentTitle.tsx";
import { useLocalStorage } from "@uidotdev/usehooks";
import useQueryParameters from "../Hooks/useQueryParameters.tsx";
import getDistanceBetweenPoints from "../Funtions/getDistanceBetweenPoints.tsx"
import getLocationName from "../Funtions/getLocationName.tsx"
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import "../Styles/Radix.css";
import "../Styles/Map.css";

const API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = "http://localhost:5173/";
type Data = { 
	name: string; 
	lat: number;
	lng: number;
  }

const MapApi = () => {
	const { params, setQueryParameters } = useQueryParameters();
	const { copyToClipboard } = useClipboard();
	const [storedLocation, setStoredLocation] = useLocalStorage<{lat: number, lng:number}>("mapLocation", { lat: 9.8990415, lng: -84.1556396 });
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
	const [markers, setMarkers] = useState<
		google.maps.marker.AdvancedMarkerElement[]
	>([]);
	const {
		register,
		handleSubmit,
		formState: { errors }
	  } = useForm<Data>();
	useEffect(() => {
		// Initialize and add the map
		((g) => {
			let h;
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
				: (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
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
				setStoredLocation({
					lat: clickedLat,
					lng: clickedLng,
				});
				const fetchName = async () => {
					const placeName = await getLocationName(clickedLat, clickedLng, API);
					setPageTitle(placeName);
				};
				fetchName();
				setQueryParameters("latitude", String(clickedLat));
				setQueryParameters("longitude", String(clickedLng));
				const locationURL = `${BASE_URL}?latitude=${clickedLat}&longitude=${clickedLng}`;

				//the infowindow has diferent carateristics so we are going to divided by sections
				const contentString = `
				<div>
					<p className= "infoWindow-text">Lat ${clickedLat.toFixed(5)}, Lng: ${clickedLng.toFixed(5)}</p>
					<button className="copy-btn"> Copy to clipboard </button>
				</div>
				`;

				//shows infowindow with the coords
				infoWindow.setContent(contentString);
				infoWindow.setPosition({ lat: clickedLat, lng: clickedLng });
				infoWindow.open(map);

				//Wait for the infowindow to be rendered
				setTimeout(() => {
					const copyBtn = document.getElementById("copy-btn") as HTMLElement;
					if (copyBtn) {
						copyBtn.addEventListener("click", () =>
							copyToClipboard(locationURL),
						);
					}
				}, 3000);
			};
			map.addListener("click", handleMapClick);
			return () => {
				window.google.maps.event.clearListeners(map, "click"); //clear listeners
			};
		}
	}, [map, infoWindow]);


	const handleSubmitSetMarker = async (data : Data) => {
		const pos = {
			lat: Number(data.lat),
			lng: Number(data.lng),
		};

		const { AdvancedMarkerElement } =
			await google.maps.importLibrary("marker");

		const marker = await new AdvancedMarkerElement({
			map: map,
			position: pos,
			title: data.name,
		});
		const placeName = await getLocationName(latitude, longitude, API);
		await setStoredLocation({
			lat: pos.lat,
			lng: pos.lng,
		});
		setMarkers([...markers, marker]);
		setPageTitle(placeName);
		if (map) {
			map.panTo(pos);
			map.setZoom(14);
		}
		setOpen(false);
	};

	const handleRemove = async (
		item: google.maps.marker.AdvancedMarkerElement,
	) => {
		setMarkers((markers) => {
			return markers.filter((marker) => marker !== item);
		});
		item.setMap(null);
	};

	const handleClickWhereAmI = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				setLoading(true);
				setLatitude(position.coords.latitude);
				setLongitude(position.coords.longitude);
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				setStoredLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				if (map) {
					map.panTo(pos);
					map.setZoom(14);
				}
				const { AdvancedMarkerElement } =
					await google.maps.importLibrary("marker");
				new AdvancedMarkerElement({
					map: map,
					position: pos,
					title: "My location",
				});
				const placeName = await getLocationName(pos.lat, pos.lng, API);

				setPageTitle(placeName);
				setLoading(false);
			});
			const fetchDistance = async () => {
				const distance = await getDistanceBetweenPoints({ lat: 10, lng: 150.644 },{ lat: -34.397, lng: 150.644 })
				console.log(distance);
			};
			fetchDistance(); //Fetch distance check
			
			
		} else {
			// Browser doesn't support Geolocation
			alert("Browser doesn't support Geolocation!!!");
		}
	};

	useDocumentTitle(pageTitle);

	return (
		<div id="general-container">
			<title> {pageTitle} </title>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<button type="button" className="Button violet" onClick={() => setOpen(true)}>Add new marker</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="DialogOverlay" />
					<Dialog.Content className="DialogContent">
						<Dialog.Title className="DialogTitle">Add new marker</Dialog.Title>
						<Dialog.Description className="DialogDescription">
							Put the correct details of your marker. Click save when you're done.
						</Dialog.Description>
						<form className="form-markers" onSubmit={handleSubmit(handleSubmitSetMarker)}>
							<fieldset className="Fieldset">
								<label className="Label" htmlFor="name">
									Name
								</label>
								<input className="Input" id="name" defaultValue="Home"
									type={"text"}
									placeholder={"Enter name"}
									{...register("name", {
										required: true,
										minLength: 4
									})}
								/>
							</fieldset>
							<fieldset className="Fieldset">
								<label className="Label" htmlFor="latitude">
									Latitude
								</label>
								<input className="Input" id="latitude" defaultValue="0" step="0.000001" min="-90" max="90"
									type={"number"}
									placeholder={"Enter latitude"}
									{...register("lat", {
										required: true,
										minLength: 1
									})}
								/>
							</fieldset>
							<fieldset className="Fieldset">
								<label className="Label" htmlFor="longitude">
									Longitude
								</label>
								<input className="Input" id="longitude" defaultValue="0" step="0.000001" min="-90" max="90"
									type={"number"}
									placeholder={"Enter longitude"}
									{...register("lng", {
										required: true,
										minLength: 1
									})}
								/>
							</fieldset>
						<div className="save-button"
						>

								<button type="submit" className="Button green">Save marker</button>
						</div>
						</form>
						<Dialog.Close asChild>
							<button type="button" className="IconButton" aria-label="Close">
								<Cross2Icon />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
			<button
				className="Button"
				type="button"
				disabled={isLoading}
				onClick={handleClickWhereAmI}
			>
				{isLoading ? "Loading..." : "Where am i?"}
			</button>
			<div id="map-list">
				<div id="marker-list">
					<h2>List of markers</h2>
					{markers.length <= 0
						? "You dont have markers yet"
						: markers.map((item, index) => (
								<li key={index}>
									<span id="list-element">{item.title}</span>
									<button className="Button" type="button" onClick={() => handleRemove(item)}>
										Remove
									</button>
								</li>
							))}
				</div>
				<div id="map-container" />
			</div>
		</div>
	);
};
export default MapApi;
