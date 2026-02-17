import { useEffect, useState, useMemo } from 'react';
import { Card } from "../card/Card";
import classes from './CardList.module.css';
import type {Product} from "../../types/product.types.ts";
import type {ApiResponse} from "../../types/index.types.ts";
import type {CardListProps} from "../../types/card.types.ts";

const ITEMS_PER_PAGE = 8;

const CardList: React.FC<CardListProps> = ({ filters, onTotalFoundChange }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('./data/data.json');
                const data: ApiResponse = await response.json();
                setAllProducts(data.goods);
            } catch (error) {
                console.error('Ошибка при загрузке:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (allProducts.length === 0) return [];

        let result = [...allProducts];

        // Фильтр по цене
        result = result.filter(product => {
            const finalPrice = product.discount > 0
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price;
            return finalPrice >= filters.priceRange.min && finalPrice <= filters.priceRange.max;
        });

        // Фильтр по брендам
        if (filters.brands.length > 0) {
            result = result.filter(product => filters.brands.includes(product.brand));
        }

        // Фильтр по категориям
        if (filters.categories.length > 0) {
            result = result.filter(product => {
                return filters.categories.some(category => {
                    const productText = `${product.brand} ${product.name} ${product.key_features.processor}`.toLowerCase();
                    return productText.includes(category.toLowerCase());
                });
            });
        }

        // Сортировка
        switch (filters.sortBy) {
            case 'price_asc':
                result.sort((a, b) => {
                    const priceA = a.discount > 0 ? Math.round(a.price * (1 - a.discount / 100)) : a.price;
                    const priceB = b.discount > 0 ? Math.round(b.price * (1 - b.discount / 100)) : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price_desc':
                result.sort((a, b) => {
                    const priceA = a.discount > 0 ? Math.round(a.price * (1 - a.discount / 100)) : a.price;
                    const priceB = b.discount > 0 ? Math.round(b.price * (1 - b.discount / 100)) : b.price;
                    return priceB - priceA;
                });
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
            default:
                result.sort((a, b) => b.reviews_count - a.reviews_count);
                break;
        }

        return result;
    }, [allProducts, filters]);

    // Отдельный эффект для уведомления родителя о количестве найденных товаров
    useEffect(() => {
        if (onTotalFoundChange) {
            onTotalFoundChange(filteredProducts.length);
        }
    }, [filteredProducts.length, onTotalFoundChange]);

    // Сбрасываем страницу при изменении фильтров
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Вычисляем отображаемые продукты на основе текущей страницы
    const displayedProducts = useMemo(() => {
        const endIndex = currentPage * ITEMS_PER_PAGE;
        return filteredProducts.slice(0, endIndex);
    }, [filteredProducts, currentPage]);

    // Проверяем, есть ли еще товары для загрузки
    const hasMore = useMemo(() => {
        return currentPage * ITEMS_PER_PAGE < filteredProducts.length;
    }, [currentPage, filteredProducts.length]);

    // Загрузка следующих товаров
    const loadMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    if (loading) {
        return <div className={classes.loading}>Загрузка...</div>;
    }

    if (filteredProducts.length === 0) {
        return (
            <div className={classes.empty}>
                <p>Товары не найдены</p>
                <p className={classes.emptyHint}>Попробуйте изменить параметры фильтрации</p>
            </div>
        );
    }

    return (
        <div className={classes.cardListContainer}>
            <div className={classes.gridContainer}>
                {displayedProducts.map((product) => (
                    <Card
                        key={product.id}
                        id={product.id}
                        brand={product.brand}
                        name={product.name}
                        key_features={product.key_features}
                        rating={product.rating}
                        reviews_count={product.reviews_count}
                        price={product.price}
                        discount={product.discount}
                        is_new={product.is_new}
                        photos={product.photos}
                    />
                ))}
            </div>

            {hasMore && (
                <div className={classes.loadMoreContainer}>
                    <button
                        className={classes.loadMoreButton}
                        onClick={loadMore}
                    >
                        Показать еще
                    </button>
                    <div className={classes.loadMoreInfo}>
                        Показано {displayedProducts.length} из {filteredProducts.length} товаров
                    </div>
                </div>
            )}

            {!hasMore && filteredProducts.length > ITEMS_PER_PAGE && (
                <div className={classes.allLoaded}>
                    Показаны все {filteredProducts.length} товаров
                </div>
            )}
        </div>
    );
};

export default CardList;