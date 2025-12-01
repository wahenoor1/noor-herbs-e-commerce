import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import Account from './pages/Account';
import TrackOrder from './pages/TrackOrder';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Shop": Shop,
    "ProductDetails": ProductDetails,
    "Cart": Cart,
    "Checkout": Checkout,
    "OrderConfirmation": OrderConfirmation,
    "About": About,
    "Contact": Contact,
    "Account": Account,
    "TrackOrder": TrackOrder,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};