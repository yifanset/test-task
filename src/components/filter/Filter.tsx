import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classes from './Filter.module.css';
import type { Category, FilterProps, SortByType } from "../../types/filter.types";

const brandsData = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Google',
    'OnePlus',
    'Huawei',
    'Sony',
    'LG'
];

const categoriesData: Category[] = [
    {
        id: 'smartphones',
        name: 'Смартфоны',
        children: [
            { id: 'android', name: 'Android' },
            { id: 'ios', name: 'iOS' },
            { id: 'foldable', name: 'Складные' }
        ]
    },
    {
        id: 'laptops',
        name: 'Ноутбуки',
        children: [
            { id: 'ultrabooks', name: 'Ультрабуки' },
            { id: 'gaming', name: 'Игровые' },
            { id: 'office', name: 'Офисные' }
        ]
    },
    {
        id: 'tablets',
        name: 'Планшеты',
        children: [
            { id: 'android-tablets', name: 'Android' },
            { id: 'ios-tablets', name: 'iPad' },
            { id: 'windows-tablets', name: 'Windows' }
        ]
    },
    {
        id: 'wearables',
        name: 'Носимые устройства',
        children: [
            { id: 'smartwatches', name: 'Смарт-часы' },
            { id: 'fitness-bands', name: 'Фитнес-браслеты' },
            { id: 'smart-glasses', name: 'Умные очки' }
        ]
    },
    {
        id: 'audio',
        name: 'Аудио',
        children: [
            { id: 'headphones', name: 'Наушники' },
            { id: 'earbuds', name: 'TWS гарнитуры' },
            { id: 'speakers', name: 'Колонки' }
        ]
    }
];

export const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortByType>('popular');
    const [brandSearch, setBrandSearch] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [priceInput, setPriceInput] = useState({ min: '0', max: '200000' });

    // Мемоизируем текущие фильтры для отправки
    const currentFilters = useMemo(() => ({
        priceRange,
        brands: selectedBrands,
        categories: selectedCategories,
        sortBy
    }), [priceRange, selectedBrands, selectedCategories, sortBy]);

    // Отправляем фильтры при изменении
    useEffect(() => {
        onFilterChange(currentFilters);
    }, [currentFilters, onFilterChange]);

    // Обработчики для цены
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPriceInput(prev => ({ ...prev, min: value }));

        const numValue = parseInt(value) || 0;
        if (numValue <= priceRange.max) {
            setPriceRange(prev => ({ ...prev, min: numValue }));
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPriceInput(prev => ({ ...prev, max: value }));

        const numValue = parseInt(value) || 0;
        if (numValue >= priceRange.min) {
            setPriceRange(prev => ({ ...prev, max: numValue }));
        }
    };

    const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value <= priceRange.max) {
            setPriceRange(prev => ({ ...prev, min: value }));
            setPriceInput(prev => ({ ...prev, min: value.toString() }));
        }
    };

    const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= priceRange.min) {
            setPriceRange(prev => ({ ...prev, max: value }));
            setPriceInput(prev => ({ ...prev, max: value.toString() }));
        }
    };

    // Обработчики для брендов
    const handleBrandToggle = useCallback((brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    }, []);

    const filteredBrands = useMemo(() =>
        brandsData.filter(brand =>
            brand.toLowerCase().includes(brandSearch.toLowerCase())
        ), [brandSearch]
    );

    // Обработчики для категорий
    const handleCategoryToggle = useCallback((categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    }, []);

    const toggleCategoryExpand = useCallback((categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    }, []);

    // Сброс всех фильтров
    const resetFilters = useCallback(() => {
        setPriceRange({ min: 0, max: 200000 });
        setPriceInput({ min: '0', max: '200000' });
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSortBy('popular');
        setBrandSearch('');
        setExpandedCategories([]);
    }, []);

    // Рекурсивный рендер категорий
    const renderCategory = useCallback((category: Category, level: number = 0): React.ReactNode => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.includes(category.id);
        const isSelected = selectedCategories.includes(category.id);

        return (
            <div key={category.id} className={classes.categoryItem} style={{ marginLeft: `${level * 20}px` }}>
                <div className={classes.categoryRow}>
                    {hasChildren && (
                        <button
                            type="button"
                            className={classes.expandButton}
                            onClick={() => toggleCategoryExpand(category.id)}
                            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
                        >
                            {isExpanded ? '▼' : '▶'}
                        </button>
                    )}
                    <label className={classes.categoryLabel}>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCategoryToggle(category.id)}
                        />
                        <span className={classes.categoryName}>{category.name}</span>
                    </label>
                </div>

                {hasChildren && isExpanded && (
                    <div className={classes.categoryChildren}>
                        {category.children!.map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    }, [expandedCategories, selectedCategories, handleCategoryToggle, toggleCategoryExpand]);

    return (
        <div className={classes.filter}>
            <h2 className={classes.title}>Фильтры</h2>

            <div className={classes.container}>
                <section>
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>Сортировка</h3>
                        <select
                            className={classes.select}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortByType)}
                            aria-label="Сортировка"
                        >
                            <option value="popular">По популярности</option>
                            <option value="price_asc">Цена: по возрастанию</option>
                            <option value="price_desc">Цена: по убыванию</option>
                            <option value="rating">По рейтингу</option>
                        </select>
                    </div>

                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>Цена, ₽</h3>

                        <div className={classes.sliders}>
                            <div className={classes.sliderContainer}>
                                <span className={classes.sliderLabel}>от {priceRange.min.toLocaleString('ru-RU')}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="200000"
                                    step="1000"
                                    value={priceRange.min}
                                    onChange={handleMinSliderChange}
                                    className={classes.slider}
                                    aria-label="Минимальная цена"
                                />
                            </div>
                            <div className={classes.sliderContainer}>
                                <span className={classes.sliderLabel}>до {priceRange.max.toLocaleString('ru-RU')}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="200000"
                                    step="1000"
                                    value={priceRange.max}
                                    onChange={handleMaxSliderChange}
                                    className={classes.slider}
                                    aria-label="Максимальная цена"
                                />
                            </div>
                        </div>

                        <div className={classes.priceInputs}>
                            <input
                                type="text"
                                value={priceInput.min}
                                onChange={handleMinPriceChange}
                                className={classes.priceInput}
                                placeholder="от"
                                aria-label="Минимальная цена"
                            />
                            <span className={classes.priceDash}>—</span>
                            <input
                                type="text"
                                value={priceInput.max}
                                onChange={handleMaxPriceChange}
                                className={classes.priceInput}
                                placeholder="до"
                                aria-label="Максимальная цена"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>Бренд</h3>

                        <input
                            type="text"
                            placeholder="Поиск бренда..."
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className={classes.searchInput}
                            aria-label="Поиск бренда"
                        />

                        <div className={classes.brandsList}>
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map(brand => (
                                    <label key={brand} className={classes.brandLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandToggle(brand)}
                                        />
                                        <span className={classes.brandName}>{brand}</span>
                                    </label>
                                ))
                            ) : (
                                <div className={classes.noResults}>Бренды не найдены</div>
                            )}
                        </div>

                        {selectedBrands.length > 0 && (
                            <div className={classes.selectedCount}>
                                Выбрано: {selectedBrands.length}
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>Категории</h3>
                        <div className={classes.categoriesList}>
                            {categoriesData.map(category => renderCategory(category))}
                        </div>
                        {selectedCategories.length > 0 && (
                            <div className={classes.selectedCount}>
                                Выбрано: {selectedCategories.length}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className={classes.actions}>
                <button
                    className={classes.resetButton}
                    onClick={resetFilters}
                    type="button"
                >
                    Сбросить фильтры
                </button>
            </div>
        </div>
    );
};