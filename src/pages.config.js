/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AdminAffiliates from './pages/AdminAffiliates';
import AdminBlogs from './pages/AdminBlogs';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AffiliateLogin from './pages/AffiliateLogin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetails from './pages/ProductDetails';
import RefundPolicy from './pages/RefundPolicy';
import SeaBuckthorn from './pages/SeaBuckthorn';
import Shop from './pages/Shop';
import TermsAndConditions from './pages/TermsAndConditions';
import TestEmail from './pages/TestEmail';
import TrackOrder from './pages/TrackOrder';
import WomensHealth from './pages/WomensHealth';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAffiliates": AdminAffiliates,
    "AdminBlogs": AdminBlogs,
    "AdminDashboard": AdminDashboard,
    "AdminLogin": AdminLogin,
    "AdminProducts": AdminProducts,
    "AffiliateDashboard": AffiliateDashboard,
    "AffiliateLogin": AffiliateLogin,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Cart": Cart,
    "Checkout": Checkout,
    "Contact": Contact,
    "FAQ": FAQ,
    "Home": Home,
    "OrderConfirmation": OrderConfirmation,
    "ProductDetails": ProductDetails,
    "RefundPolicy": RefundPolicy,
    "SeaBuckthorn": SeaBuckthorn,
    "Shop": Shop,
    "TermsAndConditions": TermsAndConditions,
    "TestEmail": TestEmail,
    "TrackOrder": TrackOrder,
    "WomensHealth": WomensHealth,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};