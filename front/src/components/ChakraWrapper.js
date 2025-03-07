"use client";

import { ChakraProvider, extendTheme, useColorModeValue } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Montserrat } from 'next/font/google';
import { cache } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Configuração de tema
const theme = extendTheme({
  fonts: {
    body: montserrat.style.fontFamily,
    heading: montserrat.style.fontFamily,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', 'gray.800')(props),
        color: mode('gray.800', 'white')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export function ChakraWrapper({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}