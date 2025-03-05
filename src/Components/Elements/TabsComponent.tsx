import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Filters from "./FilterComponent.tsx";
import MarkersComponent from "./MarkerCardComponent.tsx";

interface Filters {
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
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMarkeredData: any[];
  handleRemove: (id: string) => void;
  handleEdit: (id: string) => void;
  handleTarget: (marker: any) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  filters,
  setFilters,
  open,
  setOpen,
  filteredMarkeredData,
  handleRemove,
  handleEdit,
  handleTarget,
}) => {
  return (
    <div className="general-container">
      <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList" aria-label="Navigation">
          <Tabs.Trigger className="TabsTrigger" value="tab1">Filters</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">Markers</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="TabsContent" value="tab1">
          <Filters filters={filters} setFilters={setFilters} />
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="tab2">
          <MarkersComponent
            open={open}
            setOpen={setOpen}
            filteredMarkeredData={filteredMarkeredData}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            handleTarget={handleTarget}
          />
        </Tabs.Content>
      </Tabs.Root>
      <div id="map-container" />
    </div>
  );
};

export default TabsComponent;