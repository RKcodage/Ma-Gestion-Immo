import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn("VITE_GOOGLE_CLIENT_ID manquant : GoogleOAuthProvider ne sera pas fonctionnel.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId || ""}>
        <App />
      </GoogleOAuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
