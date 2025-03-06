import {
	Card,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import {
	HeartFilledIcon,
	HeartIcon,
	StarIcon,
	TargetIcon,
} from "@radix-ui/react-icons";
import {
	IconButton
} from "@radix-ui/themes"
import type * as React from "react";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AlertDialogMarker from "./AlertDialogMarker.tsx";
import "@radix-ui/themes/styles.css";
import "swiper/css";
import "swiper/css/navigation";

type Food =
	| "Asian"
	| "Italian"
	| "Fast-Food"
	| "Fine-Dining"
	| "Local-Food"
	| "Buffet";

interface MarkerCardProps {
	name: string;
	description: string;
	images: string[];
	onDelete: () => void;
	onEdit: () => void;
	onTarget: () => void;
	rating: number;
	favorite: boolean;
	price: number;
	foodType: Food;
}
const MarkerCard: React.FC<MarkerCardProps> = ({
	name,
	description,
	images,
	onDelete,
	onEdit,
	onTarget,
	rating,
	favorite,
	price,
	foodType,
}) => {
	const hasImages = images.length > 0;
	const defaultImage =
		"https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
	return (
		<Card sx={{ maxWidth: 345, marginBottom: 2 }}>
			<Swiper navigation={true} modules={[Navigation, A11y]} slidesPerView={1}>
				{hasImages ? (
					images.map((url, index) => (
						<SwiperSlide key={index}>
							<img
								src={url}
								alt={`${name}-${index}`}
								style={{ width: "100%", height: 200, objectFit: "cover" }}
							/>
						</SwiperSlide>
					))
				) : (
					<SwiperSlide>
						<img
							src={defaultImage}
							alt="Not available"
							style={{ width: "100%", height: 200, objectFit: "cover" }}
						/>
					</SwiperSlide>
				)}
			</Swiper>
			<CardContent onClick={onTarget}>
				<Typography gutterBottom variant="h5">
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
				<Typography variant="h6" color="success">
					Average Price: ${price}
				</Typography>
				<Typography variant="h6">Food type: {foodType}</Typography>
			</CardContent>
			<CardActions className="bottom-card">
				{favorite ? <HeartFilledIcon  width="35" height="35"/> : <HeartIcon width="35" height="35"/>}
				<div>
					<StarIcon width="35" height="35"/>
					{rating}
				</div>
				<IconButton radius="large" color="orange" variant="ghost" onClick={onTarget} aria-label="Get to location">
					<TargetIcon width="35" height="35"/>
				</IconButton>
				<AlertDialogMarker
					name={name}
					onDelete={() => onDelete()}
					aria-label="Delete marker"
				/>
			</CardActions>
		</Card>
	);
};

export default MarkerCard;
