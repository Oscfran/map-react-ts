import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import * as CheckBox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, Cross2Icon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";

interface AddMarkerDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MarkerFormData {
  name: string;
  lat: number;
  lng: number;
  description: string;
  rating: number;
  price: number;
  foodType: string;
  favorite: boolean;
  imageURLs: string[];
}

const AddMarkerDialog: React.FC<AddMarkerDialogProps> = ({ setOpen }) => {
  const { register, handleSubmit, setValue, reset } = useForm<MarkerFormData>();
  const [sliderValue, setSliderValue] = useState(3);
  const [favorite, setFavorite] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const handleAddImage = () => {
    if (imageURL.trim() !== "") {
      setImageURLs([...imageURLs, imageURL]);
      setImageURL("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageURLs(imageURLs.filter((_, i) => i !== index));
  };

  const onSubmit = (data: MarkerFormData) => {
    data.imageURLs = imageURLs;
    console.log("New Marker Data:", data);
    reset();
    setImageURLs([]);
    setOpen(false);
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Add New Marker</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Enter the details of your marker and click save when done.
        </Dialog.Description>
        <form className="form-markers" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="name">Name</label>
            <input className="Input" id="name" type="text" placeholder="Enter name" {...register("name", { required: true, minLength: 4 })} />
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="latitude">Latitude</label>
            <input className="Input" id="latitude" type="number" step="0.000001" min="-90" max="90" placeholder="Enter latitude" {...register("lat", { required: true })} />
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="longitude">Longitude</label>
            <input className="Input" id="longitude" type="number" step="0.000001" min="-180" max="180" placeholder="Enter longitude" {...register("lng", { required: true })} />
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="description">Description</label>
            <input className="Input" id="description" type="text" placeholder="Enter description" maxLength={200} {...register("description", { required: true })} />
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label">Rating</label>
            <Slider.Root className="SliderRoot" value={[sliderValue]} min={1} max={5} step={0.5}
              onValueChange={(value) => {
                setValue("rating", value[0]);
                setSliderValue(value[0]);
              }}>
              <Slider.Track className="SliderTrack">
                <Slider.Range className="SliderRange" />
              </Slider.Track>
              <Slider.Thumb className="SliderThumb" aria-label="Rating" />
            </Slider.Root>
            <span className="Label">{sliderValue} <StarIcon /></span>
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="price">Price $</label>
            <input className="Input" id="price" type="number" min={0} max={500} placeholder="Enter average price" {...register("price", { required: true })} />
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="foodType">Type of Food</label>
            <Select.Root defaultValue="Asian" onValueChange={(value) => setValue("foodType", value)}>
              <Select.Trigger className="SelectTrigger" aria-label="Food type">
                <Select.Value placeholder="Select a type…" />
                <Select.Icon className="SelectIcon"><ChevronDownIcon /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="SelectContent">
                  <Select.Viewport className="SelectViewport">
                    {["Asian", "Italian", "Fast-Food", "Fine-Dining", "Local-Food", "Buffet"].map((type) => (
                      <Select.Item key={type} className="SelectItem" value={type}>
                        <Select.ItemText>{type}</Select.ItemText>
                        <Select.ItemIndicator className="SelectItemIndicator"><CheckIcon /></Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label">Favorite</label>
            <CheckBox.Root checked={favorite} className="CheckboxRoot"
              onCheckedChange={(checked) => {
                setValue("favorite", !!checked);
                setFavorite(!!checked);
              }}>
              <CheckBox.Indicator className="CheckboxIndicator"><CheckIcon /></CheckBox.Indicator>
            </CheckBox.Root>
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="images">Image URLs</label>
            <input className="Input" id="images" type="text" placeholder="Enter image URL"
              value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
            <button type="button" className="Button green" onClick={handleAddImage}>Add Image</button>
          </fieldset>

          <ul className="item-images">
            {imageURLs.length === 0 ? "No images added" : imageURLs.map((url, index) => (
              <li key={`${url}-${index}`} className="item-images">
                {url.substring(0, 15)}...{" "}
                <button type="button" className="Button green" onClick={() => handleRemoveImage(index)}>
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>

          <div className="save-button">
            <button type="submit" className="Button green" aria-label="Save marker">Save Marker</button>
          </div>
        </form>

        <Dialog.Close asChild>
          <button type="button" className="IconButton" aria-label="Close"><Cross2Icon /></button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default AddMarkerDialog;
