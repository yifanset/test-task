import React, { useState } from 'react';
import classes from './Card.module.css';
import type {CardProps} from "../../types/card.types.ts";
import {useCart} from "../../hooks/useCart.ts";


export const Card: React.FC<CardProps> = ({
                                              id,
                                              brand,
                                              name,
                                              key_features,
                                              rating,
                                              reviews_count,
                                              price,
                                              discount,
                                              is_new,
                                              photos
                                          }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCompare, setIsCompare] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();

    // Вычисляем цену со скидкой
    const discountedPrice = discount > 0
        ? Math.round(price * (1 - discount / 100))
        : price;

    // Функция для отображения звезд рейтинга
    const renderRatingStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} className={classes.starFull}>★</span>);
            } else if (hasHalfStar && i === fullStars + 1) {
                stars.push(<span key={i} className={classes.starHalf}>★</span>);
            } else {
                stars.push(<span key={i} className={classes.starEmpty}>★</span>);
            }
        }
        return stars;
    };

    // Функции для переключения фото
    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
        }
    };

    // Обработчики для кнопок
    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const toggleCompare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCompare(!isCompare);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Создаем объект продукта из пропсов
        const product = {
            id,
            brand,
            name,
            key_features,
            rating,
            reviews_count,
            price,
            discount,
            is_new,
            photos
        };

        addToCart(product, 1);
        setAddedToCart(true);

        // Сбрасываем состояние через 2 секунды
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className={classes.card}>
            {/* Бейджи */}
            <div className={classes.badges}>
                {discount > 0 && (
                    <div className={classes.discountBadge}>-{discount}%</div>
                )}
                {is_new && (
                    <div className={classes.newBadge}>Новинка</div>
                )}
            </div>

            {/* Фото с листалкой */}
            <div className={classes.imageContainer}>
                {photos.length > 0 ? (
                    <>
                        <img
                            src={photos[currentPhotoIndex]}
                            alt={`${brand} ${name} - фото ${currentPhotoIndex + 1}`}
                            className={classes.image}
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    className={`${classes.navButton} ${classes.prevButton}`}
                                    onClick={prevPhoto}
                                    aria-label="Предыдущее фото"
                                >
                                    ‹
                                </button>
                                <button
                                    className={`${classes.navButton} ${classes.nextButton}`}
                                    onClick={nextPhoto}
                                    aria-label="Следующее фото"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {photos.length > 1 && (
                            <div className={classes.indicators}>
                                {photos.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${classes.indicator} ${index === currentPhotoIndex ? classes.activeIndicator : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentPhotoIndex(index);
                                        }}
                                        aria-label={`Перейти к фото ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {photos.length > 1 && (
                            <div className={classes.photoCounter}>
                                {currentPhotoIndex + 1} / {photos.length}
                            </div>
                        )}
                    </>
                ) : (
                    <div className={classes.noImage}>Нет изображения</div>
                )}
            </div>

            {/* Название товара */}
            <div className={classes.titleContainer}>
                <span className={classes.brand}>{brand}</span>
                <h3 className={classes.title}>{name}</h3>
            </div>

            {/* Ключевые характеристики */}
            <div className={classes.features}>
                <div className={classes.feature}>
                    <span className={classes.featureLabel}>Память:</span>
                    <span className={classes.featureValue}>{key_features.memory}</span>
                </div>
                <div className={classes.feature}>
                    <span className={classes.featureLabel}>Экран:</span>
                    <span className={classes.featureValue}>{key_features.display}</span>
                </div>
                <div className={classes.feature}>
                    <span className={classes.featureLabel}>Процессор:</span>
                    <span className={classes.featureValue}>{key_features.processor}</span>
                </div>
            </div>

            {/* Рейтинг и отзывы */}
            <div className={classes.ratingContainer}>
                <div className={classes.stars}>
                    {renderRatingStars()}
                </div>
                <span className={classes.ratingValue}>{rating.toFixed(1)}</span>
                <span className={classes.reviewsCount}>({reviews_count})</span>
            </div>

            {/* Цена */}
            <div className={classes.priceContainer}>
                {discount > 0 ? (
                    <>
                        <span className={classes.oldPrice}>{price.toLocaleString('ru-RU')} ₽</span>
                        <span className={classes.currentPrice}>{discountedPrice.toLocaleString('ru-RU')} ₽</span>
                    </>
                ) : (
                    <span className={classes.currentPrice}>{price.toLocaleString('ru-RU')} ₽</span>
                )}
            </div>

            {/* Кнопки действий */}
            <div className={classes.actions}>
                <button
                    className={`${classes.cartButton} ${addedToCart ? classes.addedToCart : ''}`}
                    onClick={handleAddToCart}
                >
                    {addedToCart ? '✓ Добавлено' : 'В корзину'}
                </button>
                <div className={classes.iconButtons}>
                    <button
                        className={`${classes.iconButton} ${isFavorite ? classes.activeIconButton : ''}`}
                        onClick={toggleFavorite}
                        aria-label="В избранное"
                    >
                        {isFavorite ? '❤️' : '♡'}
                    </button>
                    <button
                        className={`${classes.iconButton} ${isCompare ? classes.activeIconButton : ''}`}
                        onClick={toggleCompare}
                        aria-label="Сравнить"
                    >
                        {isCompare ? '⬌' : '⇄'}
                    </button>
                </div>
            </div>
        </div>
    );
};