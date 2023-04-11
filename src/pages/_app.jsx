import { ChakraProvider, Button } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

import theme from "../theme";
import { useRouter } from "next/router";
import GuideLineButton from "../components/common/GuideLineButton";
import Navbar from "../components/common/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

import { Box, Divider, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

function MyApp({ Component, pageProps, session }) {
  const router = useRouter();

  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        {!router.pathname.startsWith("/auth/") && (
          <>
            <Navbar />
          </>
        )}
        <Box>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Component {...pageProps} />
        </Box>
        <GuideLineButton />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;

//getServerSideProps
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
