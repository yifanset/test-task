import { useState } from 'react';
import { CartProvider } from './context/CartProvider';
import CardList from "./components/card-list/CardList";
import { Filter } from "./components/filter/Filter";
import classes from './App.module.css';
import Header from "./components/header/Header.tsx";
import type {FilterState} from "./types/filter.types.ts";


function App() {
    const [filters, setFilters] = useState<FilterState>({
        priceRange: { min: 0, max: 200000 },
        brands: [],
        categories: [],
        sortBy: 'popular'
    });
    const [totalFound, setTotalFound] = useState<number>(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const handleTotalFoundChange = (count: number) => {
        setTotalFound(count);
    };

    const handleCartToggle = (isOpen: boolean) => {
        setIsCartOpen(isOpen);
    };

    return (
        <CartProvider>
            <Header onCartToggle={handleCartToggle} />
            <div className={classes.app}>
                <div className={classes.container}>
                    <Filter onFilterChange={handleFilterChange} />
                    <div className={classes.content}>
                        <div className={classes.resultsHeader}>
                            <h2 className={classes.resultsTitle}>
                                Найдено товаров: <span className={classes.resultsCount}>{totalFound}</span>
                            </h2>
                        </div>
                        <CardList
                            filters={filters}
                            onTotalFoundChange={handleTotalFoundChange}
                        />
                    </div>
                </div>

                {isCartOpen && <div className={classes.backdrop} />}
            </div>

        </CartProvider>
    );
}

export default App
