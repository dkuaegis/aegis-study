import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { ToastProvider } from "./components/ui/useToast.tsx";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
