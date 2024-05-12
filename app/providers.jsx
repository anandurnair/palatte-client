"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store"; // Import persistor from store
import { PrimeReactProvider } from "primereact/api";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <PrimeReactProvider>
            <NextThemesProvider attribute="class">
              {children}
            </NextThemesProvider>
          </PrimeReactProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
