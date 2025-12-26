import About from './pages/About';
import AdminAffiliates from './pages/AdminAffiliates';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AffiliateLogin from './pages/AffiliateLogin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import TestEmail from './pages/TestEmail';
import TrackOrder from './pages/TrackOrder';
import WomensHealth from './pages/WomensHealth';
import SeaBuckthorn from './pages/SeaBuckthorn';
import Blog from './pages/Blog';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAffiliates": AdminAffiliates,
    "AffiliateDashboard": AffiliateDashboard,
    "AffiliateLogin": AffiliateLogin,
    "Cart": Cart,
    "Checkout": Checkout,
    "Contact": Contact,
    "Home": Home,
    "OrderConfirmation": OrderConfirmation,
    "ProductDetails": ProductDetails,
    "Shop": Shop,
    "TestEmail": TestEmail,
    "TrackOrder": TrackOrder,
    "WomensHealth": WomensHealth,
    "SeaBuckthorn": SeaBuckthorn,
    "Blog": Blog,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};