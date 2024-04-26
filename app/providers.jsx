
"use client";

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export  function Providers({children}) {
  return (
    <Provider store={store}>
    <NextUIProvider>
      <NextThemesProvider attribute="class" >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
    </Provider>
  )
}