import React, { useState, useMemo } from 'react';
import type { CartItem, Product } from "../types/product.types";
import { CartContext } from './cart.context';

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Добавление товара в корзину
    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);

            if (existingItem) {
                // Если товар уже есть, увеличиваем количество
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Если товара нет, добавляем новый
                return [...prev, { ...product, quantity }];
            }
        });
    };

    // Удаление товара из корзины
    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // Обновление количества товара
    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;

        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    // Очистка корзины
    const clearCart = () => {
        setCartItems([]);
    };

    // Расчет цены со скидкой для товара
    const getItemFinalPrice = (item: CartItem): number => {
        return item.discount > 0
            ? Math.round(item.price * (1 - item.discount / 100))
            : item.price;
    };

    // Подытог
    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const finalPrice = getItemFinalPrice(item);
            return sum + (finalPrice * item.quantity);
        }, 0);
    }, [cartItems]);

    // Сумма скидок по товарам
    const itemDiscounts = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            if (item.discount > 0) {
                const originalTotal = item.price * item.quantity;
                const discountedTotal = getItemFinalPrice(item) * item.quantity;
                return sum + (originalTotal - discountedTotal);
            }
            return sum;
        }, 0);
    }, [cartItems]);

    // Общее количество товаров
    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            subtotal,
            itemDiscounts,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};