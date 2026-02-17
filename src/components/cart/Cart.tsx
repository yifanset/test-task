import React, { useState, useMemo } from 'react';
import classes from './Cart.module.css';
import { useCart } from "../../hooks/useCart";
import type {CartItem} from "../../types/product.types.ts";

interface CartProps {
    onClose?: () => void;
    onCheckout?: () => void;
    onContinueShopping?: () => void;
}

// Скидки по промокодам
const PROMO_CODES: Record<string, number> = {
    'WELCOME10': 10,
    'SALE20': 20,
    'SPECIAL15': 15,
    'FREESHIP': 0
};

export const Cart: React.FC<CartProps> = ({
                                              onClose,
                                              onCheckout,
                                              onContinueShopping
                                          }) => {
    const { cartItems, removeFromCart, updateQuantity, subtotal, itemDiscounts } = useCart();

    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
    const [deliveryCost, setDeliveryCost] = useState(500); // Стоимость доставки по умолчанию

    // Расчет цены со скидкой для товара
    const getItemFinalPrice = (item: CartItem): number => {
        return item.discount > 0
            ? Math.round(item.price * (1 - item.discount / 100))
            : item.price;
    };

    // Расчет стоимости позиции
    const getItemTotal = (item: CartItem): number => {
        return getItemFinalPrice(item) * item.quantity;
    };

    // Применение промокода
    const applyPromoCode = () => {
        const code = promoCode.trim().toUpperCase();

        if (!code) {
            setPromoError('Введите промокод');
            return;
        }

        if (appliedPromo && appliedPromo.code === code) {
            setPromoError('Промокод уже применен');
            return;
        }

        const discount = PROMO_CODES[code];

        if (discount !== undefined) {
            setAppliedPromo({ code, discount });
            setPromoError('');
            setPromoCode('');

            // Если промокод на бесплатную доставку
            if (code === 'FREESHIP') {
                setDeliveryCost(0);
            }
        } else {
            setPromoError('Недействительный промокод');
        }
    };

    // Удаление промокода
    const removePromoCode = () => {
        setAppliedPromo(null);
        setDeliveryCost(500);
    };

    // Расчет скидки по промокоду
    const promoDiscount = useMemo(() => {
        if (!appliedPromo || appliedPromo.discount === 0) return 0;
        return Math.round(subtotal * (appliedPromo.discount / 100));
    }, [appliedPromo, subtotal]);

    // Итоговая сумма
    const total = useMemo(() => {
        return subtotal - promoDiscount + deliveryCost;
    }, [subtotal, promoDiscount, deliveryCost]);

    // Обработчик оформления заказа
    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        const orderData = {
            items: cartItems,
            subtotal,
            itemDiscounts,
            promoDiscount,
            deliveryCost,
            total,
            appliedPromo
        };

        console.log('Оформление заказа:', orderData);

        if (onCheckout) {
            onCheckout();
        } else {
            alert('Заказ оформлен! Спасибо за покупку!');
        }
    };

    // Пустая корзина
    if (cartItems.length === 0) {
        return (
            <div className={classes.cart}>
                <div className={classes.cartHeader}>
                    <h2 className={classes.cartTitle}>Корзина</h2>
                    <button className={classes.closeButton} onClick={onClose} aria-label="Закрыть">
                        ×
                    </button>
                </div>
                <div className={classes.emptyCart}>
                    <div className={classes.emptyIcon}>🛒</div>
                    <h2 className={classes.emptyTitle}>Корзина пуста</h2>
                    <p className={classes.emptyText}>
                        Добавьте товары в корзину, чтобы оформить заказ
                    </p>
                    <button
                        className={classes.catalogButton}
                        onClick={onContinueShopping}
                    >
                        В каталог
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.cart}>
            <div className={classes.cartHeader}>
                <h2 className={classes.cartTitle}>Корзина</h2>
                <button className={classes.closeButton} onClick={onClose} aria-label="Закрыть">
                    ×
                </button>
            </div>

            <div className={classes.cartContent}>
                <div className={classes.cartItems}>
                    {cartItems.map((item: CartItem) => (
                        <div key={item.id} className={classes.cartItem}>
                            <div className={classes.itemImage}>
                                {item.photos.length > 0 ? (
                                    <img src={item.photos[0]} alt={`${item.brand} ${item.name}`} />
                                ) : (
                                    <div className={classes.noImage}>📷</div>
                                )}
                            </div>

                            <div className={classes.itemInfo}>
                                <div className={classes.itemBrand}>{item.brand}</div>
                                <div className={classes.itemName}>{item.name}</div>
                                <div className={classes.itemFeatures}>
                                    <span>{item.key_features.memory}</span>
                                    <span>{item.key_features.display}</span>
                                    <span>{item.key_features.processor}</span>
                                </div>
                            </div>

                            <div className={classes.itemPrice}>
                                {item.discount > 0 ? (
                                    <>
                                        <span className={classes.oldPrice}>
                                            {item.price.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <span className={classes.currentPrice}>
                                            {getItemFinalPrice(item).toLocaleString('ru-RU')} ₽
                                        </span>
                                    </>
                                ) : (
                                    <span className={classes.currentPrice}>
                                        {item.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                )}
                            </div>

                            <div className={classes.itemQuantity}>
                                <button
                                    className={classes.quantityButton}
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    −
                                </button>
                                <span className={classes.quantityValue}>{item.quantity}</span>
                                <button
                                    className={classes.quantityButton}
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <div className={classes.itemTotal}>
                                {getItemTotal(item).toLocaleString('ru-RU')} ₽
                            </div>

                            <button
                                className={classes.removeButton}
                                onClick={() => removeFromCart(item.id)}
                                aria-label="Удалить товар"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className={classes.cartSummary}>
                    <h3 className={classes.summaryTitle}>Ваш заказ</h3>

                    <div className={classes.summaryRow}>
                        <span>Подытог:</span>
                        <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>

                    {itemDiscounts > 0 && (
                        <div className={classes.summaryRow}>
                            <span>Скидки на товары:</span>
                            <span className={classes.discountValue}>
                                -{itemDiscounts.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>
                    )}

                    {appliedPromo && (
                        <div className={classes.promoApplied}>
                            <div className={classes.summaryRow}>
                                <span>
                                    Промокод: {appliedPromo.code}
                                    {appliedPromo.discount > 0 && ` (-${appliedPromo.discount}%)`}
                                </span>
                                <span className={classes.discountValue}>
                                    {appliedPromo.discount > 0
                                        ? `-${promoDiscount.toLocaleString('ru-RU')} ₽`
                                        : 'Бесплатная доставка'}
                                </span>
                            </div>
                            <button
                                className={classes.removePromo}
                                onClick={removePromoCode}
                            >
                                Удалить
                            </button>
                        </div>
                    )}

                    <div className={classes.summaryRow}>
                        <span>Доставка:</span>
                        <span>
                            {deliveryCost === 0
                                ? 'Бесплатно'
                                : `${deliveryCost.toLocaleString('ru-RU')} ₽`}
                        </span>
                    </div>

                    <div className={`${classes.summaryRow} ${classes.totalRow}`}>
                        <span>Итого:</span>
                        <span className={classes.totalAmount}>
                            {total.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>

                    <div className={classes.promoSection}>
                        <div className={classes.promoInput}>
                            <input
                                type="text"
                                placeholder="Введите промокод"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className={promoError ? classes.errorInput : ''}
                                disabled={!!appliedPromo}
                            />
                            <button
                                onClick={applyPromoCode}
                                disabled={!!appliedPromo || !promoCode.trim()}
                                className={classes.applyButton}
                            >
                                Применить
                            </button>
                        </div>
                        {promoError && (
                            <div className={classes.promoError}>{promoError}</div>
                        )}
                        {!appliedPromo && (
                            <div className={classes.promoTips}>
                                Доступные промокоды: WELCOME10, SALE20, FREESHIP
                            </div>
                        )}
                    </div>

                    <div className={classes.cartActions}>
                        <button
                            className={classes.continueButton}
                            onClick={onContinueShopping}
                        >
                            Продолжить покупки
                        </button>
                        <button
                            className={classes.checkoutButton}
                            onClick={handleCheckout}
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};