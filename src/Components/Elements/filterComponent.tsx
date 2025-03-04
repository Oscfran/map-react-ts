import * as CheckBox from "@radix-ui/react-checkbox";
import { CheckIcon, HeartFilledIcon, StarIcon } from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

interface FiltersProps {
	filters: {
		searchQuery: string;
		minRating: number;
		onlyFavorites: boolean;
		onlyVisibleArea: boolean;
        asianFood: boolean;
        italianFood : boolean;
        fastFood : boolean;
        fineDiningFood : boolean;
        localFood : boolean;
        buffetFood: boolean;
        maxPrice: number;
	};
	setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
	const [ratingSliderValue, setRatingSliderValue] = useState(filters.minRating);
    const [priceSliderValue, setPriceSliderValue] = useState(filters.maxPrice);
	return (
		<div className="filters">
			<input
				placeholder="Search by name…"
				className="Input"
				value={filters.searchQuery}
				onChange={(e) =>
					setFilters((prev: any) => ({ ...prev, searchQuery: e.target.value }))
				}
			/>
			<div className="checkBoxGroup">
				<div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.onlyFavorites}
                        aria-label="Check box only favorite"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, onlyFavorites: !!checked }))
						}
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
                        aria-label="Check box only visible area"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, onlyVisibleArea: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">Show only in visible area</label>
				</div>
			</div>

			{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className="Slider">
				Minimun Rating:
				<Slider.Root
					className="SliderRoot"
					value={[filters.minRating]}
					min={0}
					max={5}
					step={0.5}
					onValueChange={(value) => {
						setFilters((prev) => ({ ...prev, minRating: value[0] }));
						setRatingSliderValue(value[0]);
					}}
				>
					<Slider.Track className="SliderTrack">
						<Slider.Range className="SliderRange" />
					</Slider.Track>
					<Slider.Thumb className="SliderThumb" aria-label="Rating" />
				</Slider.Root>
				<span className="Label">
					{" "}
					{ratingSliderValue} <StarIcon />{" "}
				</span>
                
			</label>

            <div className="food-types">
				<div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.asianFood}
                        aria-label="Check box filter asian food"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, asianFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Asian Food
					</label>
				</div>

                <div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.italianFood}
                        aria-label="Check box filter italian food"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, italianFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Italian Food
					</label>
				</div>

                <div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.fastFood}
                        aria-label="Check box filter fast food"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, fastFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Fast Food
					</label>
				</div>

                <div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.fineDiningFood}
                        aria-label="Check box filter fine dining food"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, fineDiningFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Fine Dining Food
					</label>
				</div>

                <div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.localFood}
                        aria-label="Check box filter local food"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, localFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Local Food
					</label>
				</div>

                <div className="checkbox-wrapper">
					<CheckBox.Root
						checked={filters.buffetFood}
                        aria-label="Check box filter buffed"
						onCheckedChange={(checked) =>
							setFilters((prev) => ({ ...prev, buffetFood: !!checked }))
						}
						className="CheckboxRoot"
					>
						<CheckBox.Indicator className="CheckboxInicator">
							<CheckIcon />
						</CheckBox.Indicator>
					</CheckBox.Root>
					{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
					<label className="Label-checkbox">
						Buffet
					</label>
				</div>
			</div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className="Slider">
				Max Price:  
				<Slider.Root
					className="SliderRoot"
					value={[filters.maxPrice]}
					min={0}
					max={500}
					step={1}
					onValueChange={(value) => {
						setFilters((prev) => ({ ...prev, maxPrice: value[0] }));
						setPriceSliderValue(value[0]);
					}}
				>
					<Slider.Track className="SliderTrack">
						<Slider.Range className="SliderRange" />
					</Slider.Track>
					<Slider.Thumb className="SliderThumb" aria-label="Max Price" />
				</Slider.Root>
				<span className="Label">
					{" "}
					${priceSliderValue}{" "}
				</span>
                
			</label>
		</div>
	);
};

export default Filters;
