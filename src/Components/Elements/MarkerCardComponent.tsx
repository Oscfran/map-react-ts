import * as Dialog from "@radix-ui/react-dialog";
import type React from "react";
import AddMarkerDialog from "./AddMarkerDialog";
import MarkerCard from "./MarkerCard";

type Food =
	| "Asian"
	| "Italian"
	| "Fast-Food"
	| "Fine-Dining"
	| "Local-Food"
	| "Buffet";
interface Marker {
	id: string;
	name: string;
	description: string;
	imageURLs: string[];
	rating: number;
	favorite: boolean;
	price: number;
	foodType: Food;
}

interface MarkersComponentProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  map: google.maps.Map;
  markers: google.maps.marker.AdvancedMarkerElement[];
  setMarkers: React.Dispatch<React.SetStateAction<any>>;
  setMarkerData: React.Dispatch<React.SetStateAction<any>>;
  setPageTitle: React.Dispatch<React.SetStateAction<any>>;
  updatePosition: React.Dispatch<React.SetStateAction<any>>;
  API: string;
  latitude: number;
	longitude: number;
	filteredMarkeredData: Marker[];
	handleRemove: (id: string) => void;
	handleEdit: (id: string) => void;
	handleTarget: (marker: Marker) => void;
}

const MarkersComponent: React.FC<MarkersComponentProps> = ({
	open,
	setOpen,
	filteredMarkeredData,
	handleRemove,
	handleEdit,
	handleTarget,
  map,
  markers,
  setMarkers,
  setMarkerData,
  setPageTitle,
  updatePosition,
  API,
  latitude,
  longitude
}) => {
	return (
		<div className="markers-container">
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<button
						type="button"
						className="Button orange"
						onClick={() => setOpen(true)}
					>
						Add new restaurant
					</button>
				</Dialog.Trigger>

				<AddMarkerDialog 
          setOpen={setOpen}
          map={map}
          markers={markers}
          setMarkers={setMarkers}
          setMarkerData={setMarkerData}
          setPageTitle={setPageTitle}
          updatePosition={updatePosition}
          API={API}
          latitude={latitude}
          longitude={longitude}
        />
			</Dialog.Root>

			<div className="marker-list">
				<h2>List of Restaurants</h2>
				{filteredMarkeredData.length === 0 ? (
					<p>No restaurants to show</p>
				) : (
					filteredMarkeredData.map((marker) => (
						<MarkerCard
							key={marker.id}
							name={marker.name}
							description={marker.description}
							images={marker.imageURLs}
							onDelete={() => handleRemove(marker.id)}
							onEdit={() => handleEdit(marker.id)}
							onTarget={() => handleTarget(marker)}
							rating={marker.rating}
							favorite={marker.favorite}
							price={marker.price}
							foodType={marker.foodType}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default MarkersComponent;
