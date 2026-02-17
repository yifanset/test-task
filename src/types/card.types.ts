import type {FilterState} from "./filter.types.ts";

export interface CardListProps {
    filters: FilterState;
    onTotalFoundChange?: (count: number) => void;
}

export interface CardProps {
    id: number;
    brand: string;
    name: string;
    key_features: {
        memory: string;
        display: string;
        processor: string;
    };
    rating: number;
    reviews_count: number;
    price: number;
    discount: number;
    is_new: boolean;
    photos: string[];
}