import * as CheckBox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
import { CheckIcon, HeartFilledIcon, StarIcon } from "@radix-ui/react-icons";


interface FiltersProps{
    filters:{
        searchQuery: string;
        minRating: number;
        onlyFavorites: boolean;
        onlyVisibleArea: boolean;
    };
    setFilters : React.Dispatch<React.SetStateAction<any>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
    return (
        <div className="filters">
                <input 
                    placeholder="Search by name…" 
                    className="Input"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters((prev: any) => ({...prev, searchQuery: e.target.value}) )}
                />
                <div className="checkBoxGroup">
                    
                    <div  className="checkbox-wrapper">
                        <CheckBox.Root
                            checked={filters.onlyFavorites}
                            onCheckedChange={(checked) => setFilters((prev) => ({...prev, onlyFavorites: !!checked}) )}
                            className="CheckboxRoot"
                        >
                            <CheckBox.Indicator className="CheckboxInicator">
                                <CheckIcon />
                            </CheckBox.Indicator>
                        </CheckBox.Root>
                        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                        <label className="Label-checkbox">
                            Show only favorites <HeartFilledIcon />
                        </label>
                    </div>

                    
                    <div className="checkbox-wrapper">
                        <CheckBox.Root
                            checked={filters.onlyVisibleArea}
                            onCheckedChange={(checked) => setFilters((prev) => ({...prev, onlyVisibleArea: !!checked}) )}
                            className="CheckboxRoot"
                        >
                            <CheckBox.Indicator className="CheckboxInicator">
                                <CheckIcon />
                            </CheckBox.Indicator>
                        </CheckBox.Root>
                        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                        <label className="Label-checkbox">
                            Show only in visible area
                        </label>
                    </div>
                </div>
                
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="Slider">
                    Minimun Rating:
                    <Slider.Root
                        className="SliderRoot"
                        value={[filters.minRating]}
                        onValueChange={(value) => setFilters((prev) => ({...prev, minRating: value[0]}) )}
                        min={0}
                        max={5}
                        step={0.5}
                        >
                            <Slider.Track className="SliderTrack">
                                <Slider.Range className="SliderRange"/>
                            </Slider.Track>
                            <Slider.Thumb className="SliderThumb" aria-label="Rating"/>
                        </Slider.Root>
                </label>
                

        </div>
    )
}

export default Filters;