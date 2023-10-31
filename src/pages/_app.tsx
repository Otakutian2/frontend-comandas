import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../css/styles.css";
import Head from "next/head";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthWrapper from "@/components/AuthWrapper";
import WatsonAssistantChatWrapper from "@/components/WatsonAssistantChat";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Sistema de Comandas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" sizes="any" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthWrapper>
            <ProtectedRoute>
              {getLayout(<Component {...pageProps} />)}
              <WatsonAssistantChatWrapper />
            </ProtectedRoute>
          </AuthWrapper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}
