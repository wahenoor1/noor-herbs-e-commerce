import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Shop": Shop,
    "ProductDetails": ProductDetails,
    "Cart": Cart,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};