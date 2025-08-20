import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppThemeProvider } from "./providers/AppThemeProvider.tsx";
import { ToastProvider } from "./providers/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { SocketProvider } from "./providers/SocketProvider.tsx";
import { CryptoProvider } from "./providers/CryptoProvider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <CryptoProvider>
            <SocketProvider>
              <ToastProvider>
                <App />
                <ReactQueryDevtools />
              </ToastProvider>
            </SocketProvider>
          </CryptoProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </StrictMode>
);
