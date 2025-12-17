// src/main.jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
