import "../styles/globals.css";
import type { AppType } from "next/app";

import { api } from "../utils/api";
import Layout from "../components/layout";

const MyApp: AppType<{}> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(MyApp);
