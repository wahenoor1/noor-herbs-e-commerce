import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import AffiliateLogin from './pages/AffiliateLogin';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminAffiliates from './pages/AdminAffiliates';
import TestEmail from './pages/TestEmail';
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
    "TrackOrder": TrackOrder,
    "AffiliateLogin": AffiliateLogin,
    "AffiliateDashboard": AffiliateDashboard,
    "AdminAffiliates": AdminAffiliates,
    "TestEmail": TestEmail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};