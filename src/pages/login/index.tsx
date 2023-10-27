import SignInForm from "@/components/SignInForm";
import ContentCenter from "@/components/ContentCenter";
import Box from "@mui/material/Box";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
      </Head>

      <Box
        sx={{
          backgroundImage: "url('background.png')",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "color",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <ContentCenter sxProps={{ minHeight: "100svh" }}>
          <SignInForm />
        </ContentCenter>
      </Box>
    </>
  );
};

export default LoginPage;
