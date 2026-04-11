import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageLoader from './components/PageLoader';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/ErrorBoundary';
// Add page imports here
import VIGONYCFlagship from './pages/VIGONYCFlagship';
import VigoHome from './components/vigo/VigoHome';
import VigoLookbook from './components/vigo/VigoLookbook';
import VigoAbout from './components/vigo/VigoAbout';
import VigoFAQ from './components/vigo/VigoFAQ';
import VigoContact from './components/vigo/VigoContact';
import VigoDrops from './components/vigo/VigoDrops';
import VigoPress from './components/vigo/VigoPress';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth || isTransitioning) {
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
        <Route path="lookbook" element={<VigoLookbook />} />
        <Route path="about" element={<VigoAbout />} />
        <Route path="faq" element={<VigoFAQ />} />
        <Route path="contact" element={<VigoContact />} />
        <Route path="drops" element={<VigoDrops />} />
        <Route path="press" element={<VigoPress />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App