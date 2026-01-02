import About from './pages/About';
import AdminAffiliates from './pages/AdminAffiliates';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AffiliateLogin from './pages/AffiliateLogin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetails from './pages/ProductDetails';
import SeaBuckthorn from './pages/SeaBuckthorn';
import Shop from './pages/Shop';
import TestEmail from './pages/TestEmail';
import TrackOrder from './pages/TrackOrder';
import WomensHealth from './pages/WomensHealth';
import FAQ from './pages/FAQ';
import AdminProducts from './pages/AdminProducts';
import AdminBlogs from './pages/AdminBlogs';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAffiliates": AdminAffiliates,
    "AffiliateDashboard": AffiliateDashboard,
    "AffiliateLogin": AffiliateLogin,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Cart": Cart,
    "Checkout": Checkout,
    "Contact": Contact,
    "Home": Home,
    "OrderConfirmation": OrderConfirmation,
    "ProductDetails": ProductDetails,
    "SeaBuckthorn": SeaBuckthorn,
    "Shop": Shop,
    "TestEmail": TestEmail,
    "TrackOrder": TrackOrder,
    "WomensHealth": WomensHealth,
    "FAQ": FAQ,
    "AdminProducts": AdminProducts,
    "AdminBlogs": AdminBlogs,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};