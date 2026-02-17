export type SortByType = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export interface Category {
    id: string;
    name: string;
    children?: Category[];
}

export interface FilterState {
    priceRange: {
        min: number;
        max: number;
    };
    brands: string[];
    categories: string[];
    sortBy: SortByType;
}

export interface FilterProps {
    onFilterChange: (filters: FilterState) => void;
}