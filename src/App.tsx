import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BottomNav } from "./components/BottomNav";
import { RoleSwitchFab } from "./components/RoleSwitchFab";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useAuth } from "./hooks/useAuth";

const Home = lazy(() => import("./pages/(public)/Home"));
const Shop = lazy(() => import("./pages/(public)/Shop"));
const ProductDetail = lazy(() => import("./pages/(public)/ProductDetail"));
const Contact = lazy(() => import("./pages/(public)/Contact"));
const Careers = lazy(() => import("./pages/(public)/Careers"));
const About = lazy(() => import("./pages/(public)/About"));
const HelpCenter = lazy(() => import("./pages/(public)/HelpCenter"));
const FAQ = lazy(() => import("./pages/(public)/FAQ"));
const OrderTracking = lazy(() => import("./pages/(public)/OrderTracking"));
const StoreListing = lazy(() => import("./pages/(public)/StoreListing"));
const VendorOnboarding = lazy(() => import("./pages/(vendor)/onboarding"));
const VendorStorefront = lazy(() => import("./pages/(public)/VendorStorefront"));
const Checkout = lazy(() => import("./pages/(public)/Checkout"));
const ThankYou = lazy(() => import("./pages/(public)/ThankYou"));
const Cart = lazy(() => import("./pages/(customer)/Cart"));
const DashboardOverview = lazy(
  () => import("./pages/(customer)/DashboardOverview"),
);
const DashboardOrders = lazy(() => import("./pages/(customer)/DashboardOrders"));
const DashboardWishlist = lazy(
  () => import("./pages/(customer)/DashboardWishlist"),
);
const DashboardAddresses = lazy(
  () => import("./pages/(customer)/DashboardAddresses"),
);
const DashboardPayment = lazy(() => import("./pages/(customer)/DashboardPayment"));
const DashboardSettings = lazy(
  () => import("./pages/(customer)/DashboardSettings"),
);
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const VendorDashboard = lazy(() => import("./pages/(vendor)/VendorDashboard"));
const VendorProducts = lazy(() => import("./pages/(vendor)/VendorProducts"));
const VendorProductNew = lazy(() => import("./pages/(vendor)/VendorProductNew"));
const VendorProductDetail = lazy(() => import("./pages/(vendor)/VendorProductDetail"));
const VendorProductEdit = lazy(() => import("./pages/(vendor)/VendorProductEdit"));
const VendorOrders = lazy(() => import("./pages/(vendor)/VendorOrders"));
const VendorOrderDetail = lazy(() => import("./pages/(vendor)/VendorOrderDetail"));
const VendorOrderStatus = lazy(() => import("./pages/(vendor)/VendorOrderStatus"));
const VendorChat = lazy(() => import("./pages/(vendor)/VendorChat"));
const VendorAnalytics = lazy(() => import("./pages/(vendor)/VendorAnalytics"));
const VendorSettings = lazy(() => import("./pages/(vendor)/VendorSettings"));
const VendorSettingsBasic = lazy(() => import("./pages/(vendor)/VendorSettingsBasic"));
const VendorSettingsPayment = lazy(() => import("./pages/(vendor)/VendorSettingsPayment"));
const VendorSettingsBusiness = lazy(() => import("./pages/(vendor)/VendorSettingsBusiness"));
const VendorSettingsSocial = lazy(() => import("./pages/(vendor)/VendorSettingsSocial"));
const VendorSettingsNotifications = lazy(() => import("./pages/(vendor)/VendorSettingsNotifications"));
const VendorSettingsSecurity = lazy(() => import("./pages/(vendor)/VendorSettingsSecurity"));
const Notifications = lazy(() => import("./pages/Notifications"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Legal = lazy(() => import("./pages/Legal"));
const SiteMap = lazy(() => import("./pages/SiteMap"));
const NotFound = lazy(() => import("./pages/NotFound"));

function VendorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth requiredCapability="can_sell" requiredMode="vendor" requireVendorOnboarded>
      <DashboardLayout role="vendor">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth requiredCapability="can_buy" requiredMode="customer">
      <DashboardLayout role="customer">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function Router({ onInitialRouteReady }: { onInitialRouteReady: () => void }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const didSignalInitialReadyRef = useRef(false);

  const signalInitialReady = useCallback(() => {
    if (didSignalInitialReadyRef.current) return;
    didSignalInitialReadyRef.current = true;
    onInitialRouteReady();
  }, [onInitialRouteReady]);

  useEffect(() => {
    signalInitialReady();
  }, [signalInitialReady]);

  // Redirect to signup if auth record has no role (stale/invalid state)
  useEffect(() => {
    if (user && !isLoading && !user.role) {
      navigate("/auth/signup", { replace: true });
      signalInitialReady();
    }
  }, [user, isLoading, navigate, signalInitialReady]);

  if (user && !isLoading && !user.role) return null;

  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/store-listing" element={<StoreListing />} />
        <Route path="/stores" element={<StoreListing />} />
        <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={(
            <ProtectedRoute requireAuth requiredCapability="can_buy" requiredMode="customer">
              <Cart />
            </ProtectedRoute>
          )}
        />

        {/* Customer Dashboard Routes */}
        <Route path="/dashboard" element={<CustomerRoute><DashboardOverview /></CustomerRoute>} />
        <Route path="/dashboard/orders" element={<CustomerRoute><DashboardOrders /></CustomerRoute>} />
        <Route path="/dashboard/wishlist" element={<CustomerRoute><DashboardWishlist /></CustomerRoute>} />
        <Route path="/dashboard/addresses" element={<CustomerRoute><DashboardAddresses /></CustomerRoute>} />
        <Route path="/dashboard/payment" element={<CustomerRoute><DashboardPayment /></CustomerRoute>} />
        <Route path="/dashboard/settings" element={<CustomerRoute><DashboardSettings /></CustomerRoute>} />
        <Route path="/dashboard/notifications" element={<CustomerRoute><Notifications /></CustomerRoute>} />

        {/* Vendor Dashboard Routes */}
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
        <Route path="/vendor/products" element={<VendorRoute><VendorProducts /></VendorRoute>} />
        <Route path="/vendor/products/new" element={<VendorRoute><VendorProductNew /></VendorRoute>} />
        <Route path="/vendor/products/:productId" element={<VendorRoute><VendorProductDetail /></VendorRoute>} />
        <Route path="/vendor/products/:productId/edit" element={<VendorRoute><VendorProductEdit /></VendorRoute>} />
        <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
        <Route path="/vendor/orders/:orderId/status" element={<VendorRoute><VendorOrderStatus /></VendorRoute>} />
        <Route path="/vendor/orders/:orderId" element={<VendorRoute><VendorOrderDetail /></VendorRoute>} />
        <Route path="/vendor/chat" element={<VendorRoute><VendorChat /></VendorRoute>} />
        <Route path="/vendor/analytics" element={<VendorRoute><VendorAnalytics /></VendorRoute>} />
        <Route path="/vendor/settings" element={<VendorRoute><VendorSettings /></VendorRoute>} />
        <Route path="/vendor/settings/basic" element={<VendorRoute><VendorSettingsBasic /></VendorRoute>} />
        <Route path="/vendor/settings/payment" element={<VendorRoute><VendorSettingsPayment /></VendorRoute>} />
        <Route path="/vendor/settings/business" element={<VendorRoute><VendorSettingsBusiness /></VendorRoute>} />
        <Route path="/vendor/settings/social" element={<VendorRoute><VendorSettingsSocial /></VendorRoute>} />
        <Route path="/vendor/settings/notifications" element={<VendorRoute><VendorSettingsNotifications /></VendorRoute>} />
        <Route path="/vendor/settings/security" element={<VendorRoute><VendorSettingsSecurity /></VendorRoute>} />
        <Route path="/vendor/notifications" element={<VendorRoute><Notifications /></VendorRoute>} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verify" element={<VerifyOTP />} />

        {/* Info Pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/about" element={<About />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/store/vendor/:id" element={<VendorStorefront />} />
        <Route path="/store/vendor/:id/" element={<VendorStorefront />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you/" element={<ThankYou />} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-of-use" element={<TermsOfUse />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/404" element={<NotFound />} />
        {/* Final fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function dismissPreloader() {
  const el = document.getElementById("preloader");
  if (!el) return;

  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    el.remove();
  };

  el.style.opacity = "0";
  el.style.visibility = "hidden";
  const fallbackTimer = window.setTimeout(remove, 900);
  el.addEventListener(
    "transitionend",
    () => {
      window.clearTimeout(fallbackTimer);
      remove();
    },
    { once: true },
  );
}

function App() {
  const location = useLocation();
  const [isInitialRouteReady, setIsInitialRouteReady] = useState(false);
  const preloaderDismissedRef = useRef(false);
  const isDashboardRoute =
    location.pathname.startsWith("/vendor/") || location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!isInitialRouteReady || preloaderDismissedRef.current) return;
    preloaderDismissedRef.current = true;
    dismissPreloader();
  }, [isInitialRouteReady]);

  useEffect(() => {
    const safetyTimer = window.setTimeout(() => {
      setIsInitialRouteReady(true);
    }, 2000);

    return () => window.clearTimeout(safetyTimer);
  }, []);

  const handleInitialRouteReady = useCallback(() => {
    setIsInitialRouteReady(true);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router onInitialRouteReady={handleInitialRouteReady} />
          <RoleSwitchFab />
          {!isDashboardRoute && <BottomNav cartItemCount={1} />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
