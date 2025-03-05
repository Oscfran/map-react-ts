import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { TrashIcon, Cross2Icon } from "@radix-ui/react-icons";
import AddMarkerDialog from "./AddMarkerDialog";
import MarkerCard from "./MarkerCard";

type Food = 'Asian' | 'Italian' | 'Fast-Food' | 'Fine-Dining' | 'Local-Food' | 'Buffet';
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
}) => {
  return (
    <div className="markers-container">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button type="button" className="Button violet" onClick={() => setOpen(true)}>
            Add new marker
          </button>
        </Dialog.Trigger>

        <AddMarkerDialog setOpen={setOpen} />
      </Dialog.Root>

      <div className="marker-list">
        <h2>List of markers</h2>
        {filteredMarkeredData.length === 0 ? (
          <p>No markers to show</p>
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
