import { createContext } from 'react';
import type { CartContextType } from "../types/product.types";

export const CartContext = createContext<CartContextType | undefined>(undefined);