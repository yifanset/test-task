import { useState } from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import logo from "./assets/logo.svg";
import search from "./assets/search.svg";
import favorite from "./assets/favorite.svg";
import cart from "./assets/cart.svg";
import profile from "./assets/profile.svg";
import { Cart } from "../cart/Cart";
import {useCart} from "../../hooks/useCart.ts";

interface HeaderProps {
    onCartToggle?: (isOpen: boolean) => void;
}

const categoriesData = [
    {
        id: 'smartphones',
        name: 'Смартфоны',
        subcategories: [
            { id: 'apple', name: 'Apple', link: '/category/apple' },
            { id: 'samsung', name: 'Samsung', link: '/category/samsung' },
            { id: 'xiaomi', name: 'Xiaomi', link: '/category/xiaomi' },
            { id: 'google', name: 'Google', link: '/category/google' },
            { id: 'oneplus', name: 'OnePlus', link: '/category/oneplus' },
        ],
        popular: [
            { name: 'iPhone 15 Pro', link: '/product/1' },
            { name: 'Galaxy S24 Ultra', link: '/product/6' },
            { name: 'Xiaomi 14 Ultra', link: '/product/10' },
        ],
        promotions: [
            { name: 'Скидка 20% на iPhone', link: '/promo/iphone' },
            { name: 'Подарок при покупке', link: '/promo/gift' },
        ]
    },
    {
        id: 'laptops',
        name: 'Ноутбуки',
        subcategories: [
            { id: 'apple-laptops', name: 'MacBook', link: '/category/macbook' },
            { id: 'asus', name: 'ASUS', link: '/category/asus' },
            { id: 'lenovo', name: 'Lenovo', link: '/category/lenovo' },
            { id: 'hp', name: 'HP', link: '/category/hp' },
            { id: 'dell', name: 'Dell', link: '/category/dell' },
        ],
        popular: [
            { name: 'MacBook Air M2', link: '/product/2' },
            { name: 'ASUS ROG', link: '/product/rog' },
            { name: 'Lenovo ThinkPad', link: '/product/thinkpad' },
        ],
        promotions: [
            { name: '-15% на MacBook', link: '/promo/macbook' },
            { name: 'Рассрочка 0-0-6', link: '/promo/installment' },
        ]
    },
    {
        id: 'tablets',
        name: 'Планшеты',
        subcategories: [
            { id: 'ipad', name: 'iPad', link: '/category/ipad' },
            { id: 'samsung-tablets', name: 'Samsung Tab', link: '/category/samsung-tab' },
            { id: 'xiaomi-tablets', name: 'Xiaomi Pad', link: '/category/xiaomi-pad' },
        ],
        popular: [
            { name: 'iPad Pro', link: '/product/3' },
            { name: 'Samsung Tab S9', link: '/product/8' },
            { name: 'Xiaomi Pad 6', link: '/product/11' },
        ],
        promotions: [
            { name: 'Чехол в подарок', link: '/promo/case' },
            { name: 'Скидка 10%', link: '/promo/tablet-sale' },
        ]
    },
    {
        id: 'wearables',
        name: 'Часы и браслеты',
        subcategories: [
            { id: 'apple-watch', name: 'Apple Watch', link: '/category/apple-watch' },
            { id: 'samsung-watch', name: 'Galaxy Watch', link: '/category/galaxy-watch' },
            { id: 'xiaomi-band', name: 'Mi Band', link: '/category/mi-band' },
        ],
        popular: [
            { name: 'Apple Watch Series 9', link: '/product/4' },
            { name: 'Galaxy Watch6', link: '/product/9' },
            { name: 'Mi Smart Band 8', link: '/product/12' },
        ],
        promotions: [
            { name: '-25% на Galaxy Watch', link: '/promo/watch-sale' },
            { name: '2 ремешка в подарок', link: '/promo/straps' },
        ]
    },
    {
        id: 'audio',
        name: 'Аудио',
        subcategories: [
            { id: 'headphones', name: 'Наушники', link: '/category/headphones' },
            { id: 'earbuds', name: 'TWS гарнитуры', link: '/category/earbuds' },
            { id: 'speakers', name: 'Колонки', link: '/category/speakers' },
        ],
        popular: [
            { name: 'AirPods Pro 2', link: '/product/5' },
            { name: 'Samsung Buds', link: '/product/buds' },
            { name: 'Xiaomi Buds', link: '/product/xiaomi-buds' },
        ],
        promotions: [
            { name: 'Кейс в подарок', link: '/promo/case' },
            { name: 'Скидка 30%', link: '/promo/audio-sale' },
        ]
    }
];

const Header = ({ onCartToggle }: HeaderProps) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();

    const toggleCart = () => {
        const newState = !isCartOpen;
        setIsCartOpen(newState);
        if (onCartToggle) {
            onCartToggle(newState);
        }
    };

    const closeCart = () => {
        setIsCartOpen(false);
        if (onCartToggle) {
            onCartToggle(false);
        }
    };

    const handleCategoryHover = (categoryId: string | null) => {
        setActiveCategory(categoryId);
    };

    return (
        <>
            <div className={classes.header}>
                <div className={classes.container}>
                    {/* Логотип слева */}
                    <Link to="/" className={classes.logo}>
                        <div className={classes.txtLogo}>
                            TECH<br />STORE
                        </div>
                        <img
                            src={logo}
                            alt="logo"
                            width={37}
                            height={29.75}
                        />
                    </Link>

                    {/* Основные категории (мега-меню) */}
                    <nav className={classes.categoriesNav}>
                        {categoriesData.map(category => (
                            <div
                                key={category.id}
                                className={classes.categoryItem}
                                onMouseEnter={() => handleCategoryHover(category.id)}
                                onMouseLeave={() => handleCategoryHover(null)}
                            >
                                <button className={classes.categoryButton}>
                                    <span className={classes.categoryName}>{category.name}</span>
                                </button>

                                {/* Мега-меню (выпадающее) */}
                                {activeCategory === category.id && (
                                    <div className={classes.megaMenu}>
                                        <div className={classes.megaMenuContent}>
                                            {/* Подкатегории */}
                                            <div className={classes.menuSection}>
                                                <h4 className={classes.menuSectionTitle}>Категории</h4>
                                                <ul className={classes.subcategoryList}>
                                                    {category.subcategories.map(sub => (
                                                        <li key={sub.id}>
                                                            <Link
                                                                to={sub.link}
                                                                className={classes.subcategoryLink}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Популярные товары */}
                                            <div className={classes.menuSection}>
                                                <h4 className={classes.menuSectionTitle}>Популярное</h4>
                                                <ul className={classes.popularList}>
                                                    {category.popular.map((item, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                to={item.link}
                                                                className={classes.popularLink}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Акции */}
                                            <div className={classes.menuSection}>
                                                <h4 className={classes.menuSectionTitle}>Акции</h4>
                                                <ul className={classes.promotionList}>
                                                    {category.promotions.map((promo, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                to={promo.link}
                                                                className={classes.promotionLink}
                                                            >
                                                                {promo.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Поиск в центре */}
                    <form className={classes.searchForm} >
                        <input
                            type="text"
                            placeholder="Поиск товаров..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={classes.searchInput}
                        />
                        <button type="submit" className={classes.searchButton}>
                            <img src={search} alt="search" width={18} height={18} />
                        </button>
                    </form>

                    {/* Блок с иконками справа */}
                    <div className={classes.rightBlock}>
                        <button
                            className={classes.iconButton}
                        >
                            <img src={favorite} alt="favorite" width={20} height={20} />
                        </button>

                        <button
                            className={classes.cartButton}
                            onClick={toggleCart}
                            aria-label="Корзина"
                        >
                            <img src={cart} alt="cart" width={20} height={20} />
                            {totalItems > 0 && (
                                <span className={classes.cartBadge}>{totalItems}</span>
                            )}
                        </button>

                        <button
                            className={classes.iconButton}
                            aria-label="Профиль"
                        >
                            <img src={profile} alt="profile" width={20} height={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Оверлей корзины */}
            {isCartOpen && (
                <div className={classes.cartOverlay} onClick={closeCart}>
                    <div
                        className={classes.cartContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Cart
                            onClose={closeCart}
                            onContinueShopping={closeCart}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;