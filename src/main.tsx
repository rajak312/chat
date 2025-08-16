import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppThemeProvider } from "./providers/AppThemeProvider.tsx";
import { ToastProvider } from "./providers/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { SocketProvider } from "./providers/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AppThemeProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </SocketProvider>
  </StrictMode>
);
