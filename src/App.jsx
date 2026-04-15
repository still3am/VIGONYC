import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { ThemeProvider } from 'next-themes'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from './components/ErrorBoundary';
// Add page imports here
import VigoAdmin from './pages/VigoAdmin';
import VIGONYCFlagship from './pages/VIGONYCFlagship';
import VigoHome from './components/vigo/VigoHome';
import VigoShop from './components/vigo/VigoShop';
import VigoProduct from './components/vigo/VigoProduct';
import VigoLookbook from './components/vigo/VigoLookbook';
import VigoAbout from './components/vigo/VigoAbout';
import VigoFAQ from './components/vigo/VigoFAQ';
import VigoContact from './components/vigo/VigoContact';
import VigoWishlist from './components/vigo/VigoWishlist';
import VigoTrackOrder from './components/vigo/VigoTrackOrder';
import VigoAccount from './components/vigo/VigoAccount';
import VigoCheckout from './components/vigo/VigoCheckout';
import VigoDrops from './components/vigo/VigoDrops';
import VigoSearch from './components/vigo/VigoSearch';
import VigoNewArrivals from './components/vigo/VigoNewArrivals';
import VigoTerms from './components/vigo/VigoTerms';
import VigoPrivacy from './components/vigo/VigoPrivacy';
import VigoReturns from './components/vigo/VigoReturns';
import VigoReferral from './pages/VigoReferral';

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
    <ErrorBoundary>
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<VIGONYCFlagship />}>
        <Route index element={<ErrorBoundary><VigoHome /></ErrorBoundary>} />
        <Route path="shop" element={<ErrorBoundary><VigoShop /></ErrorBoundary>} />
        <Route path="product/:id" element={<ErrorBoundary><VigoProduct /></ErrorBoundary>} />
        <Route path="lookbook" element={<ErrorBoundary><VigoLookbook /></ErrorBoundary>} />
        <Route path="about" element={<ErrorBoundary><VigoAbout /></ErrorBoundary>} />
        <Route path="faq" element={<ErrorBoundary><VigoFAQ /></ErrorBoundary>} />
        <Route path="contact" element={<ErrorBoundary><VigoContact /></ErrorBoundary>} />
        <Route path="wishlist" element={<ErrorBoundary><VigoWishlist /></ErrorBoundary>} />
        <Route path="track-order" element={<ErrorBoundary><VigoTrackOrder /></ErrorBoundary>} />
        <Route path="account" element={<ErrorBoundary><VigoAccount /></ErrorBoundary>} />
        <Route path="checkout" element={<ErrorBoundary><VigoCheckout /></ErrorBoundary>} />
        <Route path="drops" element={<ErrorBoundary><VigoDrops /></ErrorBoundary>} />
        <Route path="search" element={<ErrorBoundary><VigoSearch /></ErrorBoundary>} />
        <Route path="new" element={<ErrorBoundary><VigoNewArrivals /></ErrorBoundary>} />
        <Route path="terms" element={<ErrorBoundary><VigoTerms /></ErrorBoundary>} />
        <Route path="privacy" element={<ErrorBoundary><VigoPrivacy /></ErrorBoundary>} />
        <Route path="returns" element={<ErrorBoundary><VigoReturns /></ErrorBoundary>} />
        <Route path="referral" element={<ErrorBoundary><VigoReferral /></ErrorBoundary>} />
      </Route>
      <Route path="/admin" element={<VigoAdmin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </ErrorBoundary>
  );
};


function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster position="bottom-right" richColors />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App