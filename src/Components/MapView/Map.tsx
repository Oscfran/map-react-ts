import { CheckIcon, ChevronDownIcon, Cross2Icon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Dialog, Slider, Tabs } from "radix-ui";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useClipboard from "../Hooks/useClipboard.tsx";
import useDocumentTitle from "../Hooks/useDocumentTitle.tsx";
import useQueryParameters from "../Hooks/useQueryParameters.tsx";
import getDistanceBetweenPoints from "../Utils/getDistanceBetweenPoints.tsx";
import getLocationName from "../Utils/getLocationName.tsx";
import "../Styles/Radix.css";
import "../Styles/Map.css";
import { Select } from "radix-ui";
import MarkerCard from "../Elements/MarkerCard.tsx";
import Filters from "../Elements/filterComponent.tsx";
import isValidURL from "../Utils/isValidURL.tsx";
import * as CheckBox from "@radix-ui/react-checkbox";
import React from "react";

const API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = "http://localhost:5173/";
type Food = 'Asian' | 'Italian' | 'Fast-Food' | 'Fine-Dining' | 'Local-Food' | 'Buffet';
interface MarkerInfo {
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
	const [filters, setFilters] = useState({
		searchQuery: "",
		minRating: 0,
		onlyFavorites: false,
		onlyVisibleArea: false,
	});
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<MarkerInfo>({
		defaultValues: {
			imageURLs: [],
			rating: 1,
			favorite : false,
			foodType : 'Asian'
		},
	});
	const [sliderValue, setSliderValue] = useState(1);
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
				: (d[l] = (f: unknown, ...n: any) => r.add(f) && u().then(() => d[l](f, ...n)));
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
					<button id="copy-btn" style="all: revert; border-radius: 4px; padding: 0 15px; font-size: 15px; line-height: 1; font-weight: 500; height: 35px; cursor : pointer"> Copy to clipboard </button>
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
		//deleting while filtering has errors due to index value
		const matchesName = marker.name
			.toLowerCase()
			.includes(filters.searchQuery.toLowerCase());
		const matchesRating = marker.rating
			? marker.rating >= filters.minRating
			: true;
		const matchesFavorites = !filters.onlyFavorites || marker.favorite;
		if (map && filters.onlyVisibleArea) {
			const bounds = map.getBounds();
			const position = new google.maps.LatLng(marker.lat, marker.lng);
			return (
				matchesName &&
				matchesRating &&
				matchesFavorites &&
				bounds?.contains(position)
			);
		}
		return matchesName && matchesRating && matchesFavorites;
	});

	const handleEdit = async (
		item: google.maps.marker.AdvancedMarkerElement,
		index: number,) => {
		console.log("bien");
	};
	const handleTarget = async(
		item: google.maps.marker.AdvancedMarkerElement,
	) => {
		const pos ={
			lat: Number(item.position?.lat),
			lng: Number(item.position?.lng)
		};
		setStoredLocation(pos);
		map?.panTo(pos);
		map?.setZoom(14);
	}

	const handleSubmitSetMarker = async (data: MarkerInfo) => {
		console.log(data.imageURLs.length);
		const pos = {
			lat: Number(data.lat),
			lng: Number(data.lng),
		};

		const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

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
		map?.panTo(pos);
		map?.setZoom(14);
		setOpen(false);
		setValue("name", "");
		setValue("lat", 0);
		setValue("lng", 0);
		setValue("description", "");
		setValue("imageURLs", []);
		setValue("favorite", false);
		setValue("rating", 0);
		setValue("foodType", 'Asian');
		setSliderValue(1);
		setFavorite(false);
	};

	const handleRemove = (
		item: google.maps.marker.AdvancedMarkerElement,
		index: number,
	) => {
		setMarkers((markers) => {
			return markers.filter((marker) => marker !== item);
		});
		setMarkerData((prev) => prev.filter((_, i) => i !== index));
		item.map = null;
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
				const distance = await getDistanceBetweenPoints(
					{ lat: 10, lng: 150.644 },
					{ lat: -34.397, lng: 150.644 },
				);
				console.log(distance);
			};
			fetchDistance(); //Fetch distance check
		} else {
			// Browser doesn't support Geolocation
			alert("Browser doesn't support Geolocation!!!");
		}
	};

	const handleAddImage = async () => {
		if (!imageURL.trim()) {
			alert("Insert URL!!!");
		}

		const isValid = await isValidURL(imageURL);
		if (isValid) {
			setValue("imageURLs", [...imageURLs, imageURL]);
			setImageURL("");
		} else if (imageURL.trim()) {
			alert("Insert a valid image URL!!!");
		}
	};
	const handleRemoveImage = (index: number) => {
		const newImageURLS = imageURLs.filter((_, i) => i !== index);
		setValue("imageURLs", newImageURLS);
	};

	useDocumentTitle(pageTitle);

	return (
		<div className="general-container">
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
							className="Button violet"
							disabled={isLoading}
							onClick={handleClickWhereAmI}
						>
							{isLoading ? "Loading..." : "Around me"}
						</button>
						<Filters filters={filters} setFilters={setFilters} />
					</div>
				</Tabs.Content>
				<Tabs.Content className="TabsContent" value="tab2">
					<Dialog.Root open={open} onOpenChange={setOpen}>
						<Dialog.Trigger asChild>
							<button
								type="button"
								className="Button violet"
								onClick={() => setOpen(true)}
							>
								Add new marker
							</button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="DialogOverlay" />
							<Dialog.Content className="DialogContent">
								<Dialog.Title className="DialogTitle">
									Add new marker
								</Dialog.Title>
								<Dialog.Description className="DialogDescription">
									Put the correct details of your marker. Click save when you're
									done.
								</Dialog.Description>
								<form
									className="form-markers"
									onSubmit={handleSubmit(handleSubmitSetMarker)}
								>
									<fieldset className="Fieldset">
										<label className="Label" htmlFor="name">
											Name
										</label>
										<input
											className="Input"
											id="name"
											type={"text"}
											placeholder={"Enter name"}
											{...register("name", {
												required: true,
												minLength: 4,
											})}
										/>
									</fieldset>
									<fieldset className="Fieldset">
										<label className="Label" htmlFor="latitude">
											Latitude
										</label>
										<input
											className="Input"
											id="latitude"
											step="0.000000000000001"
											min="-90"
											max="90"
											type={"number"}
											placeholder={"Enter latitude"}
											{...register("lat", {
												required: true,
												minLength: 1,
											})}
										/>
									</fieldset>
									<fieldset className="Fieldset">
										<label className="Label" htmlFor="longitude">
											Longitude
										</label>
										<input
											className="Input"
											id="longitude"
											step="0.000000000000001"
											min="-90"
											max="90"
											type={"number"}
											placeholder={"Enter longitude"}
											{...register("lng", {
												required: true,
												minLength: 1,
											})}
										/>
									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="description">
											Description
										</label>
										<input
											className="Input"
											id="description"
											maxLength={200}
											type="text"
											placeholder={"Enter description"}
											{...register("description", {
												required: true,
												minLength: 1,
											})}
										/>
									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="rating">
											Rating
										</label>
										<Slider.Root
											className="SliderRoot"
											min={1}
											max={5}
											step={0.5}
											onValueChange={(value) => {
												setValue("rating", value[0]);
												setSliderValue(value[0]);
											}}
											aria-label="Rating"
										>
											<Slider.Track className="SliderTrack">
												<Slider.Range className="SliderRange" />
											</Slider.Track>
											<Slider.Thumb
												className="SliderThumb"
												aria-label="Rating"
											/>
										</Slider.Root>
										<span className="Label">
											{" "}
											{sliderValue} <StarIcon />{" "}
										</span>
									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="price">
											Price $
										</label>
										<input
											className="Input"
											id="price"
											type="number"
											placeholder={"Enter average price"}
											{...register("price")}
										/>
									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="foodType">
											Type of Food
										</label>
										<Select.Root defaultValue='Asian' onValueChange={(value: Food) => setValue("foodType", value)}>
											<Select.Trigger className="SelectTrigger" aria-label="Food type">
												<Select.Value placeholder="Select a fruit…" />
												<Select.Icon className="SelectIcon">
													<ChevronDownIcon />
												</Select.Icon>
											</Select.Trigger>
											<Select.Portal>
													<Select.Content className="SelectContent">
													<Select.Viewport className="SelectViewport">
													<Select.Group>
															<Select.Item className="SelectItem" value='Asian'>
																<Select.ItemText>Asian</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>

															<Select.Item className="SelectItem" value='Italian'>
															<Select.ItemText>Italian</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>
															<Select.Item className="SelectItem" value='Fast food'>
															<Select.ItemText>Fast Food</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>

															<Select.Item className="SelectItem" value='Fine-dining'>
															<Select.ItemText>Fine Dining</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>

															<Select.Item className="SelectItem" value='Local-Food'>
															<Select.ItemText>Local Food</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>

															<Select.Item className="SelectItem" value='Buffet'>
															<Select.ItemText>Buffet</Select.ItemText>
																<Select.ItemIndicator className="SelectItemIndicator">
																	<CheckIcon />
																</Select.ItemIndicator>
															</Select.Item>
														</Select.Group>
													</Select.Viewport>
													</Select.Content>
												</Select.Portal>
										</Select.Root>
										
									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="favorite">
											Favorite
										</label>
										<CheckBox.Root
											checked={favorite}
											className="CheckboxRoot"
											onCheckedChange={(checked) => {
												setValue("favorite", !!checked);
												setFavorite(!!checked);
											}}
										>
											<CheckBox.Indicator className="CheckboxInicator">
												<CheckIcon />
											</CheckBox.Indicator>
										</CheckBox.Root>

									</fieldset>

									<fieldset className="Fieldset">
										<label className="Label" htmlFor="images">
											Image URLs
										</label>
										<input
											className="Input"
											id="images"
											type={"text"}
											placeholder={"Enter URL for images"}
											value={imageURL}
											onChange={(e) => setImageURL(e.target.value)}
										/>
										<button
											type="button"
											className="Button green"
											onClick={handleAddImage}
										>
											Add Image
										</button>
									</fieldset>
									<ul className="item-images">
										{imageURLs.length === 0
											? "You dont have images added"
											: imageURLs.map((url, index) => (
													<li key={index} className="item-images">
														{url.substring(0, 15)}
														{"...  "}
														<button
															type="button"
															className="Button green"
															onClick={() => handleRemoveImage(index)}
														>
															{" "}
															<TrashIcon />{" "}
														</button>
													</li>
												))}
									</ul>
									<div className="save-button">
									<button
											type="submit"
											className="Button green"
											aria-label="Save marker"
										>
											Save marker
										</button>
										
									</div>
								</form>
								<Dialog.Close asChild>
									<button
										type="button"
										className="IconButton"
										aria-label="Close"
									>
										<Cross2Icon />
									</button>
								</Dialog.Close>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
					<div className="marker-list">
						<h2>List of markers</h2>
						{filteredMarkeredData.length <= 0
							? "Not markers to show"
							: filteredMarkeredData.map((marker, index) => (
									<MarkerCard
										key={index}
										name={marker.name}
										description={marker.description}
										images={marker.imageURLs}
										onDelete={() => handleRemove(markers[index], index)}
										onEdit={() => handleEdit(markers[index], index)}
										onTarget={() => handleTarget(markers[index])}
										rating={marker.rating}
										favorite={marker.favorite}
										price={marker.price}
										foodType={marker.foodType}
									/>
								))}
					</div>
				</Tabs.Content>
			</Tabs.Root>
			<div id="map-container" />
		</div>
	);
};
export default MapApi;
