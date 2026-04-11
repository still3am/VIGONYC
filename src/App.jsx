import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import VIGONYCFlagship from './pages/VIGONYCFlagship';
import VigoHome from './components/vigo/VigoHome';
import VigoShop from './components/vigo/VigoShop';
import VigoProduct from './components/vigo/VigoProduct';
import VigoLookbook from './components/vigo/VigoLookbook';
import VigoAbout from './components/vigo/VigoAbout';
import VigoSustainability from './components/vigo/VigoSustainability';
import VigoFAQ from './components/vigo/VigoFAQ';
import VigoContact from './components/vigo/VigoContact';
import VigoWishlist from './components/vigo/VigoWishlist';
import VigoTrackOrder from './components/vigo/VigoTrackOrder';
import VigoAccount from './components/vigo/VigoAccount';
import VigoCheckout from './components/vigo/VigoCheckout';
import VigoDrops from './components/vigo/VigoDrops';
import VigoPress from './components/vigo/VigoPress';
import VigoAdmin from './pages/VigoAdmin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<VIGONYCFlagship />}>
        <Route index element={<VigoHome />} />
        <Route path="shop" element={<VigoShop />} />
        <Route path="product/:id" element={<VigoProduct />} />
        <Route path="lookbook" element={<VigoLookbook />} />
        <Route path="about" element={<VigoAbout />} />
        <Route path="sustainability" element={<VigoSustainability />} />
        <Route path="faq" element={<VigoFAQ />} />
        <Route path="contact" element={<VigoContact />} />
        <Route path="wishlist" element={<VigoWishlist />} />
        <Route path="track-order" element={<VigoTrackOrder />} />
        <Route path="account" element={<VigoAccount />} />
        <Route path="checkout" element={<VigoCheckout />} />
        <Route path="drops" element={<VigoDrops />} />
        <Route path="press" element={<VigoPress />} />
      </Route>
      <Route path="/admin" element={<VigoAdmin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App