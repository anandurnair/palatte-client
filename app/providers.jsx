
"use client";

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { PrimeReactProvider } from 'primereact/api';

export  function Providers({children}) {
  return (
    <Provider store={store}>
    <NextUIProvider>
    <PrimeReactProvider>
      <NextThemesProvider attribute="class" >
        {children}
      </NextThemesProvider>
      </PrimeReactProvider>

    </NextUIProvider>
    </Provider>
  )
}