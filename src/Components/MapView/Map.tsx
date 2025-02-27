import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useClipboard from "../Hooks/useClipboard.tsx";
import useDocumentTitle from "../Hooks/useDocumentTitle.tsx";
import { useLocalStorage } from "@uidotdev/usehooks";
import useQueryParameters from "../Hooks/useQueryParameters.tsx";
import getDistanceBetweenPoints from "../Funtions/getDistanceBetweenPoints.tsx"
import getLocationName from "../Funtions/getLocationName.tsx"
import { Dialog, Tabs } from "radix-ui";
import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons";
import "../Styles/Radix.css";
import "../Styles/Map.css";
import isValidURL from "../Funtions/isValidURL.tsx";
import MarkerCard from "../Elements/MarkerCard.tsx";
import Index from "../Pages/Layout.tsx";

const API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = "http://localhost:5173/";
interface MarkerInfo { 
	name: string; 
	lat: number;
	lng: number;
	imageURLs: string[];
	description: string;
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
	const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
	const [markerData, setMarkerData] = useLocalStorage<MarkerInfo[]>("markers", []);
	const [imageURL, setImageURL] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	  } = useForm<MarkerInfo>();
	  const imageURLs = watch("imageURLs") || [];

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
					<h3>Selected location</h3>
					<p className= "infoWindow-text">Lat ${clickedLat.toFixed(5)}, Lng: ${clickedLng.toFixed(5)}</p>
					<button id="copy-btn" > Copy to clipboard </button>
				</div>
				`;

				//shows infowindow with the coords
				infoWindow.setContent(contentString);
				infoWindow.setPosition({ lat: clickedLat, lng: clickedLng });
				infoWindow.open(map);

				const observer = new MutationObserver(() => {
					const copyBtn = document.getElementById("copy-btn");
					if (copyBtn) {
						copyBtn.addEventListener("click", () =>
							copyToClipboard(locationURL)
						);
						observer.disconnect();
					}
				});
				observer.observe(document.body,{childList:true, subtree:true})
			};
			map.addListener("click", handleMapClick);
			if (markerData.length > 0){
				const fetchMarkers = async () => {
					const { AdvancedMarkerElement } =
					await google.maps.importLibrary("marker");
					
					
					const newMarkers = markerData.map((info) => {
						const marker = new AdvancedMarkerElement({
							map: map,
							position: {lat: Number(info.lat), lng:Number(info.lng)},
							title: info.name
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

	const handleSubmitSetMarker = async (data : MarkerInfo) => {
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
		setStoredLocation({
			lat: pos.lat,
			lng: pos.lng,
		});
		setMarkers([...markers, marker]);
		setMarkerData((prev) => [...prev, data]);
		setPageTitle(placeName);
		if (map) {
			map.panTo(pos);
			map.setZoom(14);
		}
		setOpen(false);
		setValue("name", "");
		setValue("lat", 0);
		setValue("lng", 0);
		setValue("description", "");
		setValue("imageURLs", []);

	};

	const handleRemove = (
		item: google.maps.marker.AdvancedMarkerElement, index: number
	) => {
		setMarkers((markers) => {
			return markers.filter((marker) => marker !== item);
		});
		setMarkerData((prev) => prev.filter((_, i) => i !== index));
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

	const handleAddImage = async () => {
		if(!imageURL.trim()){
			alert("Insert URL!!!")
		}

		const isValid = await isValidURL(imageURL);
		if(isValid){
			setValue("imageURLs", [...imageURLs,imageURL]);
			setImageURL("");
		} else if (imageURL.trim()){
			alert("Insert a valid image URL!!!");
		}
	}
	const handleRemoveImage = (index: number) =>{
		const newImageURLS = imageURLs.filter((_, i) => i !== index);
		setValue("imageURLs", newImageURLS);
	}

	useDocumentTitle(pageTitle);

	return (
		<div className="general-container">
			<title> {pageTitle} </title>


			<Tabs.Root className="TabsRoot" defaultValue="tab1">
				<Tabs.List className="TabsList" aria-label="Filters">
					<Tabs.Trigger className="TabsTrigger" value="tab1">
						Filters
					</Tabs.Trigger>
					<Tabs.Trigger className="TabsTrigger" value="tab2">
						Markers
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content className="TabsContent" value="tab1">
					<div className="filters">
						<button
							type="button"
							className="Button"
							disabled={isLoading}
							onClick={handleClickWhereAmI}
						>
							{isLoading ? "Loading..." : "Around me"}
						</button>
					</div>
				</Tabs.Content>
				<Tabs.Content className="TabsContent" value="tab2">
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
											<input className="Input" id="name"
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
											<input className="Input" id="latitude" step="0.000001" min="-90" max="90"
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
											<input className="Input" id="longitude" step="0.000001" min="-90" max="90"
												type={"number"}
												placeholder={"Enter longitude"}
												{...register("lng", {
													required: true,
													minLength: 1
												})}
											/>
										</fieldset>

										<fieldset className="Fieldset">
											<label className="Label" htmlFor="description">
												Description
											</label>
											<input className="Input" id="description" maxLength={200}
												type="text"
												placeholder={"Enter description"}
												{...register("description", {
													required: true,
													minLength: 1
												})}
											/>
										</fieldset>

										<fieldset className="Fieldset">
											<label className="Label" htmlFor="images">
												Image URLs
											</label>
											<input className="Input" id="images"
												type={"text"}
												placeholder={"Enter URL for images"}
												value={imageURL}
												onChange={(e) => setImageURL(e.target.value)}
											/>
											<button type="button" className="Button green" onClick={handleAddImage}>Add Image</button>
										</fieldset>
										<ul className="item-images">
											{imageURLs.length === 0
											? "You dont have images added"
											:
												imageURLs.map((url, index) => (
													<li key={index} className="item-images">
														{url.substring(0,15)}{"...  "}
														<button type="button" className="Button green" onClick={() => handleRemoveImage(index)}> <TrashIcon/> </button>
													</li>
												))
												}
											</ul>
									<div className="save-button"
									>

											<button type="submit" className="Button green" aria-label="Save marker">Save marker</button>
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
					<div className="marker-list">
						<h2>List of markers</h2>
						{markerData.length <= 0
							? "You dont have markers yet"
							: markerData.map((marker, index) => (
									<MarkerCard
										key={index}
										name={marker.name}
										description={marker.description}
										images={marker.imageURLs}
										onDelete={() => handleRemove(markers[index],index)}
									/>
								))}
					</div>
				</Tabs.Content>
			</Tabs.Root>
			<div id="map-container" /></div>
	);
};
export default MapApi;
