export interface Product {
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

export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    itemDiscounts: number;
    totalItems: number;
}