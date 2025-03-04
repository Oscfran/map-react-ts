import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import {
	HeartFilledIcon,
	HeartIcon,
	Pencil1Icon,
	StarIcon,
	TargetIcon
} from "@radix-ui/react-icons";
import type * as React from "react";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AlertDialogMarker from "./AlertDialogMarker.tsx";
import "swiper/css";
import "swiper/css/navigation";

type Food = 'Asian' | 'Italian' | 'Fast-Food' | 'Fine-Dining' | 'Local-Food' | 'Buffet';

interface MarkerCardProps {
	name: string;
	description: string;
	images: string[];
	onDelete: () => void;
	onEdit: () => void;
	onTarget: () => void;
	rating: number;
	favorite: boolean;
	price : number;
	foodType : Food;
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
				<Typography variant="body2">
					Average Price: ${price}
				</Typography>
				<Typography variant="body2">
					Food type: {foodType}
				</Typography>
			</CardContent>
			<CardActions className="bottom-card">
				{favorite ? <HeartFilledIcon /> : <HeartIcon />}
				<div>
					<StarIcon />
					{rating}
				</div>
				<Button size="small" onClick={onTarget} aria-label="Get to location">
					<TargetIcon />
				</Button>
				<Button size="small" onClick={onEdit} aria-label="Edit marker">
					<Pencil1Icon />
				</Button>
				<AlertDialogMarker name={name} onDelete={() => onDelete()}  aria-label="Delete marker"/>
			</CardActions>
		</Card>
	);
};

export default MarkerCard;
