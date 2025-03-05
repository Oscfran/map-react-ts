import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Filters from "./FilterComponent.tsx";
import MarkersComponent from "./MarkerCardComponent.tsx";
import { useResponsiveTabs } from "../Hooks/useResponsiveTabs.tsx"

interface FiltersProps {
  searchQuery: string;
  minRating: number;
  onlyFavorites: boolean;
  onlyVisibleArea: boolean;
  asianFood: boolean;
  italianFood: boolean;
  fastFood: boolean;
  fineDiningFood: boolean;
  localFood: boolean;
  buffetFood: boolean;
  maxPrice: number;
  clearFilters: () => void;
}

interface TabsComponentProps {
  isLoading: boolean;
  handleClickWhereAmI: () => void;
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  map: google.maps.Map;
  markers: google.maps.marker.AdvancedMarkerElement[];
  setMarkers: React.Dispatch<React.SetStateAction<any>>;
  setMarkerData: React.Dispatch<React.SetStateAction<any>>;
  setPageTitle: React.Dispatch<React.SetStateAction<any>>;
  updatePosition: React.Dispatch<React.SetStateAction<any>>;
  API: string;
  filteredMarkeredData: any[];
  handleRemove: (id: string) => void;
  handleEdit: (id: string) => void;
  handleTarget: (marker: any) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  isLoading,
  handleClickWhereAmI,
  filters,
  setFilters,
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
  API
}) => {
  const isMobile = useResponsiveTabs();
  return (
    
    <div className="general-container">
      {isMobile ? (
        <div>
        <Tabs.Root className="TabsRoot" defaultValue="tab1">
          <Tabs.List className="TabsList" aria-label="Navigation">
            <Tabs.Trigger className="TabsTrigger" value="tab1">Filters</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="tab2">Restaurants</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content className="TabsContent" value="tab1">
            <button
                type="button"
                className="Button violet"
                disabled={isLoading}
                onClick={handleClickWhereAmI}
              >
                {isLoading ? "Loading...": "Restaurants around me"}
              </button>
            <Filters filters={filters} setFilters={setFilters} />
          </Tabs.Content>

          <Tabs.Content className="TabsContent" value="tab2">
            <MarkersComponent
              open={open}
              setOpen={setOpen}
              map={map}
              markers={markers}
              setMarkers={setMarkers}
              setMarkerData={setMarkerData}
              setPageTitle={setPageTitle}
              updatePosition={updatePosition}
              filteredMarkeredData={filteredMarkeredData}
              handleRemove={handleRemove}
              handleEdit={handleEdit}
              handleTarget={handleTarget}
              API={API}
            />
          </Tabs.Content>
        </Tabs.Root>
        </div>
    ) : (
      <div>
        <div className="TabsContent">

         <MarkersComponent
              open={open}
              setOpen={setOpen}
              map={map}
              markers={markers}
              setMarkers={setMarkers}
              setMarkerData={setMarkerData}
              setPageTitle={setPageTitle}
              updatePosition={updatePosition}
              filteredMarkeredData={filteredMarkeredData}
              handleRemove={handleRemove}
              handleEdit={handleEdit}
              handleTarget={handleTarget}
              API={API}
            />
            </div>
            <div className="TabsContent">
            <button
							type="button"
							className="Button violet"
							disabled={isLoading}
							onClick={handleClickWhereAmI}
						>
            
							{isLoading ? "Loading...": "Restaurants around me"}
						</button>
            
            <Filters filters={filters} setFilters={setFilters} />
            </div>
            
        </div>
    )}
    <div id="map-container" />
    </div>

  );
};

export default TabsComponent;