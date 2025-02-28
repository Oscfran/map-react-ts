import type * as React from "react";
import {Card, CardContent, CardActions, Button, Typography} from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y} from "swiper/modules";
import { TrashIcon } from "@radix-ui/react-icons";

interface MarkerCardProps {
    name: string;
    description: string;
    images: string[];
    onDelete: () => void;
}
const MarkerCard: React.FC<MarkerCardProps> = ({name, description, images, onDelete}) => {
    const hasImages = images.length > 0;
    const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    return (
        <Card sx={{maxWidth : 345, marginBottom : 2}}>
            <Swiper navigation={true} modules = {[Navigation, A11y]}>
                {hasImages ? 
                images.map((url, index) =>(
                    <SwiperSlide key={index}>
                        <img
                            src={url}
                            alt={`${name}-${index}`}
                            style={{ width: "100%", height: 200, objectFit: "cover"}}
                        />
                    </SwiperSlide>

                ))
            : (
                <SwiperSlide>
                    <img
                        src={defaultImage}
                        alt="Not available"
                        style={{ width: "100%", height: 200, objectFit: "cover"}}
                    /> 
                </SwiperSlide>
                
            )
            }
            </Swiper>
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="error" onClick={onDelete}>
                    <TrashIcon/>
                </Button>
            </CardActions>
        </Card>
    )
}

export default MarkerCard;